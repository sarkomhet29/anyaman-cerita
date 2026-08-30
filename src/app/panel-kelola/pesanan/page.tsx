import { Navbar } from "@/components/anyaman/Navbar";
import { AdminNav } from "@/components/anyaman/AdminNav";
import { PesananRow, type BarisPesanan } from "@/components/anyaman/PesananRow";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import type { StatusPembayaran } from "@prisma/client";

export const dynamic = "force-dynamic";

const TABS: Record<string, string> = {
  semua: "Semua",
  menunggu_verifikasi: "Menunggu Verifikasi",
  aktif: "Aktif",
  ditolak: "Ditolak",
};

export default async function AdminPesananPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string; sort?: string }>;
}) {
  try {
    await requireAdmin();
  } catch {
    redirect("/panel-kelola/login");
  }

  const { tab = "menunggu_verifikasi", q = "", sort = "desc" } =
    await searchParams;
  const tabAktif = tab && TABS[tab] ? tab : "menunggu_verifikasi";

  const where: Record<string, unknown> = { paymentMethod: "manual" };
  if (tabAktif !== "semua") {
    where.status = tabAktif as StatusPembayaran;
  }
  const cari = q.trim();
  if (cari) {
    where.OR = [
      { user: { name: { contains: cari, mode: "insensitive" } } },
      { user: { email: { contains: cari, mode: "insensitive" } } },
      { orderId: { contains: cari, mode: "insensitive" } },
    ];
  }

  const transactions = await prisma.transaction.findMany({
    where,
    include: { user: true, paket: true },
    orderBy: { createdAt: sort === "asc" ? "asc" : "desc" },
  });

  const rows: BarisPesanan[] = transactions.map((tx) => ({
    id: tx.id,
    orderId: tx.orderId,
    status: tx.status,
    amount: tx.amount,
    buktiUrl: tx.buktiUrl,
    createdAt: tx.createdAt.toISOString(),
    userName: tx.user.name,
    userEmail: tx.user.email,
    paketNama: tx.paket.nama,
    undanganNama: null,
  }));

  const stats = {
    total: transactions.length,
    menunggu: transactions.filter((t) => t.status === "menunggu_verifikasi").length,
    aktif: transactions.filter((t) => t.status === "aktif").length,
    ditolak: transactions.filter((t) => t.status === "ditolak").length,
  };

  return (
    <>
      <Navbar />
      <AdminNav active="pesanan" />
      <main className="flex-1 bg-surface py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ink">Pesanan</h1>
            <p className="text-ink-soft mt-2">
              Transfer manual — verifikasi & kelola pembayaran klien.
            </p>
          </div>

          {/* Ringkasan mini */}
          <div className="mb-6 grid gap-4 sm:grid-cols-4">
            <Ringkas label="Menunggu Verifikasi" value={stats.menunggu} warna="text-blue-600" />
            <Ringkas label="Aktif" value={stats.aktif} warna="text-green-600" />
            <Ringkas label="Ditolak" value={stats.ditolak} warna="text-red-600" />
            <Ringkas label="Total (tab ini)" value={stats.total} warna="text-ink" />
          </div>

          {/* Filter */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {Object.entries(TABS).map(([key, label]) => (
                <a
                  key={key}
                  href={`/panel-kelola/pesanan?tab=${key}&q=${encodeURIComponent(
                    cari
                  )}&sort=${sort}`}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    tabAktif === key
                      ? "bg-ink text-white"
                      : "border border-line text-ink hover:border-ink"
                  }`}
                >
                  {label}
                </a>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-3">
              <form
                action="/panel-kelola/pesanan"
                className="flex items-center gap-2"
              >
                <input type="hidden" name="tab" value={tabAktif} />
                <input type="hidden" name="sort" value={sort} />
                <input
                  type="search"
                  name="q"
                  defaultValue={cari}
                  placeholder="Cari nama / email / order"
                  className="rounded-xl border border-line bg-surface-2 px-4 py-2 text-sm text-ink outline-none transition-colors focus:border-ink"
                />
                <button
                  type="submit"
                  className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-black"
                >
                  Cari
                </button>
              </form>
              <a
                href={`/panel-kelola/pesanan?tab=${tabAktif}&q=${encodeURIComponent(
                  cari
                )}&sort=${sort === "asc" ? "desc" : "asc"}`}
                className="whitespace-nowrap rounded-full border border-line px-4 py-2 text-sm font-medium text-ink hover:border-ink"
              >
                {sort === "asc" ? "Terlama ↑" : "Terbaru ↓"}
              </a>
            </div>
          </div>

          {/* Tabel */}
          <div className="overflow-x-auto rounded-2xl border border-line bg-surface-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-surface-3 text-left">
                  <th className="py-4 px-4 font-semibold text-ink">Klien</th>
                  <th className="py-4 px-4 font-semibold text-ink">
                    Paket & Harga
                  </th>
                  <th className="py-4 px-4 font-semibold text-ink">Tanggal</th>
                  <th className="py-4 px-4 font-semibold text-ink">Status</th>
                  <th className="py-4 px-4 font-semibold text-ink">Bukti</th>
                  <th className="py-4 px-4 font-semibold text-ink">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-14 text-center text-ink-soft">
                      Tidak ada pesanan pada filter ini.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => <PesananRow key={row.id} row={row} />)
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}

function Ringkas({
  label,
  value,
  warna,
}: {
  label: string;
  value: number;
  warna: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface-2 p-5">
      <p className="text-xs text-ink-soft">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${warna}`}>{value}</p>
    </div>
  );
}