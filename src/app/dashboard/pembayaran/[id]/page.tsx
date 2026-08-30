import { Navbar } from "@/components/anyaman/Navbar";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { UploadBuktiForm } from "@/components/anyaman/UploadBuktiForm";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

const REKENING_BANK = process.env.REKENING_BANK || "BCA";
const REKENING_NOMOR = process.env.REKENING_NOMOR || "1234567890";
const REKENING_ATAS_NAMA = process.env.REKENING_ATAS_NAMA || "Anyaman Cerita";

const STATUS_LABEL: Record<string, string> = {
  pending: "Menunggu Pembayaran",
  menunggu_verifikasi: "Menunggu Verifikasi",
  aktif: "Disetujui",
  ditolak: "Ditolak",
  success: "Berhasil",
  failed: "Gagal",
  expired: "Kadaluarsa",
};

const STATUS_WARNA: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  menunggu_verifikasi: "bg-blue-100 text-blue-800",
  aktif: "bg-green-100 text-green-800",
  ditolak: "bg-red-100 text-red-800",
  success: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  expired: "bg-gray-200 text-gray-700",
};

export default async function PembayaranPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const tx = await prisma.transaction.findUnique({
    where: { id },
    include: { paket: true, user: true, undangan: true },
  });

  if (!tx || tx.userId !== session.userId) {
    redirect("/dashboard");
  }

  const daftarUndangan = await prisma.undangan.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    select: { id: true, slug: true, namaUtama: true, status: true },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-surface py-16">
        <div className="mx-auto max-w-2xl px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ink">Pembayaran</h1>
            <p className="text-ink-soft mt-2">
              {tx.orderId}
            </p>
          </div>

          {/* Ringkasan pesanan */}
          <div className="rounded-2xl border border-line bg-surface-2 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-ink-soft">Status</div>
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                  STATUS_WARNA[tx.status] || "bg-gray-200 text-gray-700"
                }`}
              >
                {STATUS_LABEL[tx.status] || tx.status}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-ink">Paket {tx.paket.nama}</p>
                <p className="text-sm text-ink-soft">
                  {tx.paymentMethod === "manual" ? "Transfer manual" : "Midtrans"}
                </p>
              </div>
              <p className="text-2xl font-bold text-ink">
                Rp{tx.amount.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          {tx.status === "pending" && (
            <>
              <InstrusiTransfer />
              <div className="mt-8 rounded-2xl border border-line bg-surface p-6">
                <h2 className="text-lg font-bold text-ink mb-4">
                  Unggah Bukti Transfer
                </h2>
                <UploadBuktiForm
                  transactionId={tx.id}
                  daftarUndangan={daftarUndangan}
                />
              </div>
            </>
          )}

          {tx.status === "menunggu_verifikasi" && (
            <StatusCard
              judul="Menunggu Verifikasi Admin"
              teks="Bukti transfer sudah diterima dan sedang diperiksa admin. Kamu akan mendapatkan notifikasi setelah pesanan disetujui."
            >
              {tx.buktiUrl && (
                <img
                  src={`${appUrl}${tx.buktiUrl}`}
                  alt="Bukti transfer"
                  className="mt-4 max-h-64 rounded-xl border border-line"
                />
              )}
            </StatusCard>
          )}

          {tx.status === "aktif" && (
            <StatusCard
              judul="Pembayaran Disetujui"
              teks={
                tx.undangan
                  ? `Undangan "${tx.undangan.namaUtama}" sudah aktif.${
                      tx.undangan.aktifSampai
                        ? ` Aktif hingga ${tx.undangan.aktifSampai.toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}.`
                        : ""
                    }`
                  : "Undangan kamu sudah aktif."
              }
            >
              {tx.undangan && (
                <a
                  href={`/u/${tx.undangan.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-block rounded-full bg-ink px-6 py-3 text-sm font-medium text-white hover:bg-black"
                >
                  Lihat Undangan
                </a>
              )}
            </StatusCard>
          )}

          {tx.status === "ditolak" && (
            <>
              <StatusCard
                judul="Pembayaran Ditolak"
                teks="Bukti transfer tidak valid atau nominal tidak sesuai. Silakan unggah ulang bukti yang benar."
              />
              <div className="mt-8 rounded-2xl border border-line bg-surface p-6">
                <h2 className="text-lg font-bold text-ink mb-4">
                  Unggah Ulang Bukti Transfer
                </h2>
                <UploadBuktiForm
                  transactionId={tx.id}
                  daftarUndangan={daftarUndangan}
                />
              </div>
            </>
          )}

          {tx.status === "success" && (
            <StatusCard
              judul="Pembayaran Berhasil"
              teks="Paket sudah aktif di akun kamu. Silakan buat undangan di dashboard."
            />
          )}

          {(tx.status === "failed" || tx.status === "expired") && (
            <StatusCard
              judul="Pembayaran Gagal / Kadaluarsa"
              teks="Pembayaran tidak selesai. Silakan coba lagi dari halaman harga."
            />
          )}
        </div>
      </main>
    </>
  );
}

function InstrusiTransfer() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-line bg-surface-2 p-6">
      <h2 className="text-lg font-bold text-ink">Langkah Pembayaran</h2>
      <ol className="mt-4 space-y-3 text-sm text-ink">
        <li className="flex gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
            1
          </span>
          <span>
            Transfer <strong>ke rekening {REKENING_BANK}</strong> berikut:
            <div className="mt-2 rounded-xl border border-line bg-surface p-4">
              <p className="font-mono text-lg font-bold text-ink">
                {REKENING_NOMOR}
              </p>
              <p className="text-xs text-ink-soft">an. {REKENING_ATAS_NAMA}</p>
            </div>
          </span>
        </li>
        <li className="flex gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
            2
          </span>
          <span>
            Simpan / screenshot bukti transfer (format gambar, maks 5 MB).
          </span>
        </li>
        <li className="flex gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
            3
          </span>
          <span>
            Unggah bukti di form di bawah. Pesanan otomatis masuk antrean
            verifikasi admin.
          </span>
        </li>
      </ol>
    </div>
  );
}

function StatusCard({
  judul,
  teks,
  children,
}: {
  judul: string;
  teks: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface-2 p-8 text-center">
      <h2 className="text-xl font-bold text-ink">{judul}</h2>
      <p className="mt-3 text-sm text-ink-soft">{teks}</p>
      {children}
      <div className="mt-6">
        <a
          href="/dashboard"
          className="inline-block rounded-full border border-line px-6 py-2.5 text-sm font-medium text-ink hover:border-ink"
        >
          ← Kembali ke Dashboard
        </a>
      </div>
    </div>
  );
}