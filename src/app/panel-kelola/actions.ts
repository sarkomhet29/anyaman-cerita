"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";
import { hashPassword } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { kirimWA } from "@/lib/whatsapp";
import { periksaKekuatanPassword } from "@/lib/password";
import type { StatusPembayaran } from "@prisma/client";

// ============================================================
// USER ACTIONS
// ============================================================

export async function updateUserRoleAction(formData: FormData) {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId"));
  const role = String(formData.get("role")) === "admin" ? "admin" : "user";

  // Admin tidak boleh mencabut role dirinya sendiri
  if (userId === admin.id && role === "user") {
    throw new Error("Anda tidak bisa mencabut role admin sendiri");
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/panel-kelola/users");
}

export async function updateUserPaketAction(formData: FormData) {
  await requireAdmin();
  const userId = String(formData.get("userId"));
  const paketId = String(formData.get("paketId"));

  await prisma.user.update({
    where: { id: userId },
    data: { paketId: paketId || null },
  });
  revalidatePath("/panel-kelola/users");
}

export async function resetUserPasswordAction(formData: FormData) {
  await requireAdmin();
  const userId = String(formData.get("userId"));
  const password = String(formData.get("password"));

  if (password.length < 8) {
    throw new Error("Password minimal 8 karakter");
  }

  // Reset password akun ADMIN wajib mengikuti kebijakan password kuat.
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (user?.role === "admin") {
    const cek = periksaKekuatanPassword(password);
    if (!cek.ok) {
      throw new Error(cek.alasan);
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { password: await hashPassword(password) },
  });
  revalidatePath("/panel-kelola/users");
}

export async function deleteUserAction(formData: FormData) {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId"));

  // Proteksi: admin tidak bisa menghapus akun sendiri
  if (userId === admin.id) {
    throw new Error("Anda tidak bisa menghapus akun sendiri");
  }

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/panel-kelola/users");
}

// ============================================================
// TRANSACTION ACTIONS
// ============================================================

export async function updateTransactionStatusAction(formData: FormData) {
  await requireAdmin();
  const transactionId = String(formData.get("transactionId"));
  const status = String(formData.get("status"));

  const valid = ["success", "pending", "failed", "expired"];
  if (!valid.includes(status)) {
    throw new Error("Status tidak valid");
  }

  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!transaction) {
    throw new Error("Transaksi tidak ditemukan");
  }

  await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      status: status as StatusPembayaran,
      paidAt: status === "success" ? new Date() : null,
    },
  });

  // Jika sukses, otomatis upgrade paket user
  if (status === "success") {
    await prisma.user.update({
      where: { id: transaction.userId },
      data: { paketId: transaction.paketId },
    });
  }

  revalidatePath("/panel-kelola/transactions");
}

// ============================================================
// PAKET ACTIONS
// ============================================================

export async function createPaketAction(formData: FormData) {
  await requireAdmin();
  const nama = String(formData.get("nama")).trim();
  const harga = Number(formData.get("harga") || 0);
  const deskripsi = String(formData.get("deskripsi") || "").trim() || null;

  if (!nama) {
    throw new Error("Nama paket wajib diisi");
  }
  if (harga < 0) {
    throw new Error("Harga tidak boleh negatif");
  }

  const urutan = (await prisma.paket.count()) + 1;

  await prisma.paket.create({
    data: { nama, harga, deskripsi, urutan },
  });
  revalidatePath("/panel-kelola/paket");
}

export async function updatePaketAction(formData: FormData) {
  await requireAdmin();
  const paketId = String(formData.get("paketId"));
  const nama = String(formData.get("nama")).trim();
  const harga = Number(formData.get("harga") || 0);
  const deskripsi = String(formData.get("deskripsi") || "").trim() || null;

  if (!nama) {
    throw new Error("Nama paket wajib diisi");
  }

  await prisma.paket.update({
    where: { id: paketId },
    data: { nama, harga, deskripsi },
  });
  revalidatePath("/panel-kelola/paket");
}

export async function togglePaketHighlightAction(formData: FormData) {
  await requireAdmin();
  const paketId = String(formData.get("paketId"));
  const paket = await prisma.paket.findUnique({
    where: { id: paketId },
    select: { highlight: true },
  });

  if (paket) {
    await prisma.paket.update({
      where: { id: paketId },
      data: { highlight: !paket.highlight },
    });
  }
  revalidatePath("/panel-kelola/paket");
}

export async function deletePaketAction(formData: FormData) {
  await requireAdmin();
  const paketId = String(formData.get("paketId"));

  const paket = await prisma.paket.findUnique({
    where: { id: paketId },
    include: { _count: { select: { users: true } } },
  });

  if (!paket) {
    throw new Error("Paket tidak ditemukan");
  }
  if (paket._count.users > 0) {
    throw new Error("Paket masih dipakai user, tidak bisa dihapus");
  }

  await prisma.paketFitur.deleteMany({ where: { paketId } });
  await prisma.paket.delete({ where: { id: paketId } });
  revalidatePath("/panel-kelola/paket");
}

// ============================================================
// CONTACT INBOX ACTIONS
// ============================================================

export async function updateContactStatusAction(formData: FormData) {
  await requireAdmin();
  const messageId = String(formData.get("messageId"));
  const status = String(formData.get("status"));

  if (!["baru", "dibaca", "selesai"].includes(status)) {
    throw new Error("Status tidak valid");
  }

  await prisma.contactMessage.update({
    where: { id: messageId },
    data: { status },
  });
  revalidatePath("/panel-kelola/contact");
}

// ============================================================
// UNDANGAN ACTIONS
// ============================================================

export async function updateUndanganStatusAction(formData: FormData) {
  await requireAdmin();
  const undanganId = String(formData.get("undanganId"));
  const status = String(formData.get("status"));

  if (!["draft", "aktif"].includes(status)) {
    throw new Error("Status tidak valid");
  }

  await prisma.undangan.update({
    where: { id: undanganId },
    data: { status },
  });
  revalidatePath("/panel-kelola/undangan");
}

export async function deleteUndanganAction(formData: FormData) {
  await requireAdmin();
  const undanganId = String(formData.get("undanganId"));

  await prisma.undangan.delete({ where: { id: undanganId } });
  revalidatePath("/panel-kelola/undangan");
}

// ============================================================
// VERIFIKASI PEMBAYARAN MANUAL
// ============================================================

const MASA_AKTIF_BULAN = 3;

export async function reviewPembayaranAction(formData: FormData) {
  const admin = await requireAdmin();
  const transactionId = String(formData.get("transactionId"));
  const keputusan = String(formData.get("keputusan"));
  const catatan = String(formData.get("catatan") || "").trim() || null;
  const nominalInput = String(formData.get("nominalBukti") || "").trim();
  const nominalBukti = nominalInput ? Number(nominalInput) : null;

  if (!["setujui", "tolak"].includes(keputusan)) {
    throw new Error("Keputusan tidak valid");
  }
  if (nominalBukti !== null && (!Number.isInteger(nominalBukti) || nominalBukti <= 0)) {
    throw new Error("Nominal bukti tidak valid");
  }

  const tx = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: { user: true, paket: true, undangan: true },
  });

  if (!tx) {
    throw new Error("Transaksi tidak ditemukan");
  }

  if (tx.status !== "menunggu_verifikasi") {
    throw new Error("Transaksi tidak dalam status menunggu verifikasi");
  }

  const sekarang = new Date();

  if (keputusan === "setujui") {
    // 1) Update transaksi
    await prisma.transaction.update({
      where: { id: tx.id },
      data: {
        status: "aktif",
        verifiedById: admin.id,
        verifiedAt: sekarang,
        paidAt: sekarang,
        catatanAdmin: catatan,
        nominalBukti,
      },
    });

    // 2) Upgrade paket user
    await prisma.user.update({
      where: { id: tx.userId },
      data: { paketId: tx.paketId },
    });

    // 3) Aktifkan undangan yang dipilih + masa aktif 3 bulan
    if (tx.undanganId) {
      const masaAktif = new Date(sekarang);
      masaAktif.setMonth(masaAktif.getMonth() + MASA_AKTIF_BULAN);

      await prisma.undangan.update({
        where: { id: tx.undanganId },
        data: { status: "aktif", aktifSampai: masaAktif },
      });
    }

    // 4) Notifikasi ke klien (email, best-effort)
    try {
      await sendEmail({
        to: tx.user.email,
        subject: "Pembayaran Anda Disetujui — Undangan Aktif!",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;">
            <h2 style="color:#333;">Pembayaran Disetujui ✅</h2>
            <p>Halo ${tx.user.name || tx.user.email},</p>
            <p>Pembayaran paket <strong>${tx.paket.nama}</strong> (Rp${tx.amount.toLocaleString(
              "id-ID"
            )}) sudah disetujui. Undangan Anda kini aktif${
          tx.undangan
            ? ` dan bisa dilihat di <a href="${
                process.env.NEXT_PUBLIC_APP_URL || ""
              }/u/${tx.undangan.slug}">link ini</a>`
            : ""
        }.</p>
            <p style="text-align:center;margin:30px 0;">
              <a href="${
                process.env.NEXT_PUBLIC_APP_URL || ""
              }/dashboard" style="background:#333;color:#fff;padding:12px 28px;border-radius:24px;text-decoration:none;">Buka Dashboard</a>
            </p>
          </div>
        `,
      });
    } catch (e) {
      console.error("Gagal kirim email notifikasi klien:", e);
    }

    // 5) WA klien (Fonnte, jika nomor & token tersedia)
    if (tx.user.phone) {
      const linkUndangan = tx.undangan
        ? `\nLink undangan: ${process.env.NEXT_PUBLIC_APP_URL || ""}/u/${tx.undangan.slug}`
        : "";
      await kirimWA(
        tx.user.phone,
        `✅ *Pembayaran Anda Disetujui!*\n━━━━━━━━━━━━━━━━\nPaket : ${tx.paket.nama}\nTotal : Rp${tx.amount.toLocaleString("id-ID")}\n\nUndangan Anda sekarang AKTIF. Terima kasih!${linkUndangan}`
      );
    }
  } else {
    // Tolak
    await prisma.transaction.update({
      where: { id: tx.id },
      data: {
        status: "ditolak",
        verifiedById: admin.id,
        verifiedAt: sekarang,
        catatanAdmin: catatan,
        nominalBukti,
      },
    });

    try {
      await sendEmail({
        to: tx.user.email,
        subject: "Pembayaran Ditolak — Mohon Unggah Ulang",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;">
            <h2 style="color:#333;">Pembayaran Ditolak</h2>
            <p>Halo ${tx.user.name || tx.user.email},</p>
            <p>Bukti transfer untuk paket <strong>${tx.paket.nama}</strong> tidak
            bisa diverifikasi. Silakan unggah ulang bukti transfer yang valid
            melalui dashboard.</p>
            ${
              catatan
                ? `<p style="background:#f8f8f8;border:1px solid #eee;border-radius:8px;padding:12px;color:#555;"><strong>Alasan:</strong> ${catatan}</p>`
                : ""
            }
            <p style="text-align:center;margin:30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || ""}/dashboard" style="background:#333;color:#fff;padding:12px 28px;border-radius:24px;text-decoration:none;">Unggah Ulang</a>
            </p>
          </div>
        `,
      });
    } catch (e) {
      console.error("Gagal kirim email penolakan:", e);
    }

    // WA klien (Fonnte, jika nomor & token tersedia)
    if (tx.user.phone) {
      await kirimWA(
        tx.user.phone,
        `❌ *Pembayaran Ditolak*\n━━━━━━━━━━━━━━━━\nPaket : ${tx.paket.nama}\nTotal : Rp${tx.amount.toLocaleString("id-ID")}${
          catatan ? `\nAlasan: ${catatan}` : ""
        }\n\nMohon unggah ulang bukti transfer via dashboard.`
      );
    }
  }

  revalidatePath("/panel-kelola/verifikasi");
  revalidatePath("/panel-kelola");
  revalidatePath("/panel-kelola/pesanan");
}