"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import {
  NOMOR_WA_ADMIN,
  buatLinkWA,
  pesanPembayaranMenunggu,
} from "@/lib/notifikasi";
import { sendEmail } from "@/lib/email";
import { kirimWA } from "@/lib/whatsapp";

export type KirimBuktiState = {
  error?: string | null;
  waAdminUrl?: string | null;
};

const STATUS_VALID_DARI_PENDING = new Set(["pending", "ditolak"]);

/**
 * Klien mengunggah bukti transfer untuk transaksi miliknya sendiri.
 */
export async function kirimBuktiAction(
  _prev: KirimBuktiState,
  formData: FormData
): Promise<KirimBuktiState> {
  const session = await getSession();
  if (!session) {
    return { error: "Anda harus login terlebih dahulu." };
  }

  const transactionId = String(formData.get("transactionId") || "");
  const undanganId = String(formData.get("undanganId") || "");
  const buktiUrl = String(formData.get("buktiUrl") || "");
  const phone = String(formData.get("phone") || "").trim();

  if (!transactionId || !undanganId || !buktiUrl) {
    return { error: "Semua field wajib diisi." };
  }

  // Hanya terima path bukti dari upload internal (/api/upload), bukan URL sebarang
  if (!/^\/uploads\/[A-Za-z0-9][A-Za-z0-9._-]*$/.test(buktiUrl)) {
    return { error: "Bukti transfer tidak valid. Silakan unggah ulang." };
  }

  // Simpan nomor WA klien (opsional) untuk notifikasi status nanti
  if (phone && !/^[0-9+\s-]{8,20}$/.test(phone)) {
    return { error: "Format nomor WhatsApp tidak valid." };
  }

  const tx = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: { paket: true, user: true, undangan: true },
  });

  if (!tx || tx.userId !== session.userId) {
    return { error: "Transaksi tidak ditemukan." };
  }

  if (!STATUS_VALID_DARI_PENDING.has(tx.status)) {
    return { error: "Status transaksi tidak bisa diunggah bukti lagi." };
  }

  // Pastikan undangan milik klien sendiri
  const undangan = await prisma.undangan.findFirst({
    where: { id: undanganId, userId: session.userId },
  });
  if (!undangan) {
    return { error: "Undangan tidak ditemukan." };
  }

  await prisma.transaction.update({
    where: { id: tx.id },
    data: {
      buktiUrl,
      undanganId,
      status: "menunggu_verifikasi",
    },
  });

  // Simpan / perbarui nomor WA klien jika diisi
  if (phone) {
    await prisma.user.update({
      where: { id: session.userId },
      data: { phone },
    });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const urlVerifikasi = `${appUrl}/panel-kelola/pesanan`;

  const pesanWa = pesanPembayaranMenunggu(
    {
      orderId: tx.orderId,
      nama: tx.user.name || tx.user.email,
      paketNama: tx.paket.nama,
      amount: tx.amount,
      status: "menunggu_verifikasi",
      buktiUrl: tx.buktiUrl,
    },
    urlVerifikasi
  );

  // 1) SMA ke admin (best-effort; email bisa gagal kalau SMTP belum disetel).
  try {
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@anyamancerita.com",
      subject: `Pesanan menunggu verifikasi: ${tx.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color:#333;">Pesanan Menunggu Verifikasi</h2>
          <p><strong>Order:</strong> ${tx.orderId}</p>
          <p><strong>Nama:</strong> ${tx.user.name || tx.user.email}</p>
          <p><strong>Paket:</strong> ${tx.paket.nama}</p>
          <p><strong>Total:</strong> Rp${tx.amount.toLocaleString("id-ID")}</p>
          <p style="margin-top:20px;">
            <a href="${urlVerifikasi}" style="background:#333;color:#fff;padding:12px 28px;border-radius:24px;text-decoration:none;">Verifikasi Pembayaran</a>
          </p>
          ${tx.buktiUrl ? `<p><img src="${appUrl}${tx.buktiUrl}" style="max-width:320px;border:1px solid #ddd;border-radius:8px;"/></p>` : ""}
        </div>
      `,
    });
  } catch (e) {
    console.error("Gagal kirim email admin:", e);
  }

  // 2) WA admin (Fonnte) — best-effort; tanpa FONNTE_TOKEN tidak terkirim
  await kirimWA(NOMOR_WA_ADMIN, pesanWa);

  revalidatePath(`/dashboard/pembayaran/${tx.id}`);
  revalidatePath("/dashboard");

  return { error: null, waAdminUrl: buatLinkWA(NOMOR_WA_ADMIN, pesanWa) };
}
