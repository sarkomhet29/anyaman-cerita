import { Navbar } from "@/components/anyaman/Navbar";
import { AdminNav } from "@/components/anyaman/AdminNav";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import { reviewPembayaranAction } from "../../actions";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  menunggu_verifikasi: "Menunggu Verifikasi",
  aktif: "Aktif",
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

function linkWA(nomor: string | null | undefined): string | null {
  if (!nomor) return null;
  const bersih = nomor.replace(/[^\d]/g, "");
  if (bersih.startsWith("0")) return `https://wa.me/62${bersih.slice(1)}`;
  if (bersih.startsWith("62")) return `https://wa.me/${bersih}`;
  if (bersih.startsWith("8")) return `https://wa.me/62${bersih}`;
  return bersih ? `https://wa.me/${bersih}` : null;
}

export default async function AdminPesananDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    await requireAdmin();
  } catch {
    redirect("/panel-kelola/login");
  }

  const { id } = await params;

  const tx = await prisma.transaction.findUnique({
    where: { id },
    include: { user: true, paket: true, undangan: true, verifiedBy: true },
  });

  if (!tx || tx.paymentMethod !== "manual") {
    redirect("/panel-kelola/pesanan");
  }

  const menunggu = tx.status === "menunggu_verifikasi";
  const waUrl = linkWA(tx.user.phone);
  const fmtRp = (n: number | null | undefined) =>
    n == null ? "-" : `Rp${n.toLocaleString("id-ID")}`;

  return (
    <>
      <Navbar />
      <AdminNav active="pesanan" />
      <main className="flex-1 bg-surface py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Link
                href="/panel-kelola/pesanan"
                className="text-sm text-accent hover:underline"
              >
                ← Daftar Pesanan
              </Link>
              <h1 className="mt-2 text-3xl font-bold text-ink">
                Detail Pesanan
              </h1>
              <p className="font-mono text-sm text-ink-soft mt-1">
                {tx.orderId}
              </p>
            </div>
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                STATUS_WARNA[tx.status] || "bg-gray-200 text-gray-700"
              }`}
            >
              {STATUS_LABEL[tx.status] || tx.status}
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Klien */}
            <Kartu judul="Klien">
              <Baris label="Nama" value={tx.user.name || "-"} />
              <Baris label="Email" value={tx.user.email} />
              <Baris
                label="WhatsApp"
                value={
                  waUrl ? (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      {tx.user.phone} →
                    </a>
                  ) : (
                    "-"
                  )
                }
              />
            </Kartu>

            {/* Pesanan */}
            <Kartu judul="Pesanan">
              <Baris label="Paket" value={tx.paket.nama} />
              <Baris label="Harga" value={fmtRp(tx.amount)} />
              <Baris
                label="Tanggal pesan"
                value={tx.createdAt.toLocaleString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
              <Baris
                label="Metode"
                value={tx.paymentMethod === "manual" ? "Transfer manual" : "Midtrans"}
              />
            </Kartu>

            {/* Undangan tujuan */}
            <Kartu judul="Undangan yang akan diaktifkan">
              {tx.undangan ? (
                <>
                  <Baris label="Nama" value={tx.undangan.namaUtama} />
                  <Baris label="Jenis acara" value={tx.undangan.jenisAcara} />
                  <Baris
                    label="Tanggal acara"
                    value={tx.undangan.tanggalAcara.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  />
                  <Baris
                    label="Status"
                    value={tx.undangan.status === "aktif" ? "Aktif" : "Draft"}
                  />
                  <div className="pt-1">
                    <a
                      href={`/u/${tx.undangan.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent hover:underline"
                    >
                      Lihat undangan →
                    </a>
                  </div>
                </>
              ) : (
                <p className="text-sm text-ink-soft">
                  Belum ada undangan dipilih.
                </p>
              )}
            </Kartu>

            {/* Nominal */}
            <Kartu judul="Cek Nominal">
              <Baris label="Seharusnya" value={fmtRp(tx.amount)} />
              <Baris
                label="Tertera di bukti"
                value={
                  tx.nominalBukti ? (
                    fmtRp(tx.nominalBukti)
                  ) : (
                    <span className="text-ink-soft">Belum dicatat</span>
                  )
                }
              />
              {(tx.nominalBukti != null && tx.nominalBukti !== tx.amount) && (
                <p className="text-sm text-red-600 pt-1">
                  ⚠ Nominal tidak sesuai dengan yang seharusnya.
                </p>
              )}
            </Kartu>
          </div>

          {/* Bukti transfer */}
          <div className="mt-6 rounded-2xl border border-line bg-surface-2 p-6">
            <h2 className="text-lg font-bold text-ink mb-4">Bukti Transfer</h2>
            {tx.buktiUrl ? (
              <>
                <a
                  href={tx.buktiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tx.buktiUrl}
                    alt="Bukti transfer"
                    className="max-h-96 rounded-xl border border-line"
                  />
                </a>
                <p className="mt-3 text-xs text-ink-soft">
                  Klik gambar untuk melihat ukuran penuh (zoom) di tab baru.
                </p>
              </>
            ) : (
              <p className="text-sm text-ink-soft">Belum ada bukti diunggah.</p>
            )}
          </div>

          {/* Tindakan admin */}
          {menunggu && (
            <form
              action={reviewPembayaranAction}
              className="mt-6 rounded-2xl border border-line bg-surface-2 p-6"
            >
              <h2 className="text-lg font-bold text-ink mb-4">
                Verifikasi Pembayaran
              </h2>
              <input type="hidden" name="transactionId" value={tx.id} />

              <div>
                <label
                  htmlFor="nominalBukti"
                  className="block text-sm font-medium text-ink"
                >
                  Nominal tertera di bukti (Rp)
                </label>
                <input
                  id="nominalBukti"
                  name="nominalBukti"
                  type="number"
                  min={1}
                  step={1}
                  placeholder={String(tx.amount)}
                  className="mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-ink"
                />
                <p className="mt-1 text-xs text-ink-soft">
                  Untuk mencocokkan nominal bukti dengan yang seharusnya
                  (Rp{tx.amount.toLocaleString("id-ID")}).
                </p>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="catatan"
                  className="block text-sm font-medium text-ink"
                >
                  Catatan admin
                </label>
                <textarea
                  id="catatan"
                  name="catatan"
                  rows={3}
                  placeholder="Opsional — misal alasan penolakan"
                  className="mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-ink"
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="submit"
                  name="keputusan"
                  value="setujui"
                  className="rounded-full bg-green-600 px-8 py-3 text-sm font-semibold text-white hover:bg-green-700"
                >
                  ✓ Setujui Pembayaran
                </button>
                <button
                  type="submit"
                  name="keputusan"
                  value="tolak"
                  className="rounded-full border border-red-300 px-8 py-3 text-sm font-semibold text-red-700 hover:bg-red-50"
                >
                  ✕ Tolak
                </button>
              </div>
            </form>
          )}

          {/* Riwayat approval */}
          <div className="mt-6 rounded-2xl border border-line bg-surface-2 p-6">
            <h2 className="text-lg font-bold text-ink mb-4">
              Riwayat
            </h2>
            <div className="space-y-3 text-sm">
              <Baris
                label="Status saat ini"
                value={STATUS_LABEL[tx.status] || tx.status}
              />
              <Baris
                label="Dibuat pada"
                value={tx.createdAt.toLocaleString("id-ID")}
              />
              {tx.verifiedBy && (
                <Baris
                  label="Diverifikasi oleh"
                  value={`${tx.verifiedBy.email}${
                    tx.verifiedAt
                      ? ` · ${tx.verifiedAt.toLocaleString("id-ID")}`
                      : ""
                  }`}
                />
              )}
              {tx.paidAt && (
                <Baris
                  label="Lunas pada"
                  value={tx.paidAt.toLocaleString("id-ID")}
                />
              )}
              {tx.catatanAdmin && (
                <Baris label="Catatan admin" value={tx.catatanAdmin} />
              )}
              {!tx.verifiedBy && (
                <p className="text-xs text-ink-soft">
                  Belum ada aksi verifikasi.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function Kartu({ judul, children }: { judul: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-surface-2 p-6">
      <h2 className="text-lg font-bold text-ink mb-4">{judul}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Baris({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-ink-soft min-w-28">{label}</span>
      <span className="text-sm font-medium text-ink text-right">{value}</span>
    </div>
  );
}