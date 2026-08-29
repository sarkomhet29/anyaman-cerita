import { Navbar } from "@/components/anyaman/Navbar";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import { updateUndanganStatusAction, deleteUndanganAction } from "../actions";

export default async function AdminUndanganPage() {
  try {
    await requireAdmin();
  } catch {
    redirect("/login");
  }

  const undanganList = await prisma.undangan.findMany({
    include: {
      user: true,
      _count: { select: { tamu: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const aktif = undanganList.filter((u) => u.status === "aktif").length;
  const draft = undanganList.filter((u) => u.status === "draft").length;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-surface py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-ink">Undangan Client</h1>
              <p className="text-ink-soft mt-2">
                Total: {undanganList.length} · {aktif} aktif · {draft} draft
              </p>
            </div>
            <Link href="/admin" className="text-accent hover:underline">
              ← Kembali
            </Link>
          </div>

          <div className="rounded-2xl border border-line bg-surface-2 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line bg-surface-3">
                    <th className="text-left py-4 px-4 font-semibold text-ink">
                      Undangan
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-ink">
                      Pemilik
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-ink">
                      Acara
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-ink">
                      Tamu
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-ink">
                      Status
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-ink">
                      Dibuat
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-ink">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {undanganList.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-line hover:bg-surface transition"
                    >
                      <td className="py-4 px-4">
                        <p className="font-medium text-ink">{u.namaUtama}</p>
                        <p className="text-xs text-ink-soft">/{u.slug}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-ink">{u.user.email}</p>
                        <p className="text-xs text-ink-soft">{u.user.name}</p>
                      </td>
                      <td className="py-4 px-4 text-ink-soft">
                        {u.jenisAcara}
                        <p className="text-xs">
                          {new Date(u.tanggalAcara).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="font-medium text-ink">
                          {u._count.tamu}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            u.status === "aktif"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-ink-soft text-xs">
                        {new Date(u.createdAt).toLocaleDateString("id-ID")}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          <Link
                            href={`/u/${u.slug}`}
                            target="_blank"
                            className="text-xs text-accent hover:underline"
                          >
                            Lihat
                          </Link>
                          {/* Toggle status */}
                          <form action={updateUndanganStatusAction}>
                            <input
                              type="hidden"
                              name="undanganId"
                              value={u.id}
                            />
                            <input
                              type="hidden"
                              name="status"
                              value={u.status === "aktif" ? "draft" : "aktif"}
                            />
                            <button
                              type="submit"
                              className="text-xs text-ink-soft hover:text-ink underline"
                            >
                              {u.status === "aktif" ? "Nonaktifkan" : "Aktifkan"}
                            </button>
                          </form>
                          <form action={deleteUndanganAction}>
                            <input
                              type="hidden"
                              name="undanganId"
                              value={u.id}
                            />
                            <button
                              type="submit"
                              className="text-xs text-red-600 hover:text-red-800 hover:underline"
                            >
                              Hapus
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}