import { Navbar } from "@/components/anyaman/Navbar";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  createPaketAction,
  updatePaketAction,
  togglePaketHighlightAction,
  deletePaketAction,
} from "../actions";

export default async function AdminPaketPage() {
  try {
    await requireAdmin();
  } catch {
    redirect("/login");
  }

  const pakets = await prisma.paket.findMany({
    include: {
      _count: {
        select: { users: true, fitur: true, transactions: true },
      },
      fitur: true,
    },
    orderBy: { urutan: "asc" },
  });

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-surface py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-ink">Kelola Paket</h1>
              <p className="text-ink-soft mt-2">
                Total: {pakets.length} paket
              </p>
            </div>
            <Link href="/admin" className="text-accent hover:underline">
              ← Kembali
            </Link>
          </div>

          {/* Form tambah paket */}
          <div className="rounded-2xl border border-line bg-surface-2 p-8 mb-10">
            <h2 className="text-xl font-bold text-ink mb-6">Tambah Paket</h2>
            <form action={createPaketAction} className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-40">
                <label className="block text-xs text-ink-soft mb-1">Nama Paket</label>
                <input
                  type="text"
                  name="nama"
                  required
                  placeholder="mis. Mahal"
                  className="w-full border border-line rounded px-3 py-2 text-sm bg-surface-2 text-ink"
                />
              </div>
              <div className="w-32">
                <label className="block text-xs text-ink-soft mb-1">
                  Harga (Rp)
                </label>
                <input
                  type="number"
                  name="harga"
                  required
                  min={0}
                  placeholder="0"
                  className="w-full border border-line rounded px-3 py-2 text-sm bg-surface-2 text-ink"
                />
              </div>
              <div className="flex-1 min-w-40">
                <label className="block text-xs text-ink-soft mb-1">
                  Deskripsi
                </label>
                <input
                  type="text"
                  name="deskripsi"
                  placeholder="Deskripsi paket"
                  className="w-full border border-line rounded px-3 py-2 text-sm bg-surface-2 text-ink"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                + Tambah
              </button>
            </form>
          </div>

          {/* Daftar paket */}
          <div className="grid gap-6 md:grid-cols-2">
            {pakets.map((paket) => (
              <div
                key={paket.id}
                className={`rounded-2xl border-2 p-6 ${
                  paket.highlight
                    ? "border-accent bg-accent/5"
                    : "border-line bg-surface-2"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-ink">{paket.nama}</h3>
                    <p className="text-xs text-ink-soft">
                      {paket._count.users} user · {paket._count.fitur} fitur ·{" "}
                      {paket._count.transactions} transaksi
                    </p>
                  </div>
                  <form action={togglePaketHighlightAction}>
                    <input type="hidden" name="paketId" value={paket.id} />
                    <button
                      type="submit"
                      className={`text-xs px-3 py-1 rounded-full cursor-pointer ${
                        paket.highlight
                          ? "bg-accent/15 text-accent"
                          : "bg-surface-3 text-ink-soft hover:text-ink"
                      }`}
                    >
                      {paket.highlight ? "⭐ Favorit" : "Tandai Favorit"}
                    </button>
                  </form>
                </div>

                <form action={updatePaketAction} className="space-y-3">
                  <input type="hidden" name="paketId" value={paket.id} />
                  <input
                    type="text"
                    name="nama"
                    defaultValue={paket.nama}
                    required
                    className="w-full border border-line rounded px-3 py-2 text-sm bg-surface-2 text-ink"
                  />
                  <div className="flex gap-3">
                    <input
                      type="number"
                      name="harga"
                      defaultValue={paket.harga}
                      min={0}
                      className="w-32 border border-line rounded px-3 py-2 text-sm bg-surface-2 text-ink"
                    />
                    <input
                      type="text"
                      name="deskripsi"
                      defaultValue={paket.deskripsi || ""}
                      placeholder="Deskripsi"
                      className="flex-1 border border-line rounded px-3 py-2 text-sm bg-surface-2 text-ink"
                    />
                  </div>
                  <button
                    type="submit"
                    className="text-xs px-3 py-1.5 rounded bg-surface-3 text-ink hover:bg-surface border border-line"
                  >
                    Simpan Perubahan
                  </button>
                </form>

                <div className="mt-4 pt-4 border-t border-line">
                  <p className="text-xs font-semibold text-ink-soft mb-2">
                    Fitur slot ini:
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {paket.fitur.map((f) => (
                      <span
                        key={f.id}
                        className="text-xs bg-surface-3 text-ink-soft px-2 py-1 rounded"
                      >
                        {f.fiturKey}
                      </span>
                    ))}
                  </div>

                  <form action={deletePaketAction}>
                    <input type="hidden" name="paketId" value={paket.id} />
                    <button
                      type="submit"
                      disabled={paket._count.users > 0}
                      title={
                        paket._count.users > 0
                          ? "Tidak bisa hapus: masih dipakai user"
                          : "Hapus paket"
                      }
                      className="text-xs font-semibold text-red-600 hover:text-red-800 hover:underline disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:no-underline"
                    >
                      Hapus Paket
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}