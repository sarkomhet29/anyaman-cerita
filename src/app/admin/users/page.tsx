import { Navbar } from "@/components/anyaman/Navbar";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  updateUserRoleAction,
  updateUserPaketAction,
  resetUserPasswordAction,
  deleteUserAction,
} from "../actions";

export default async function AdminUsersPage() {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    redirect("/login");
  }

  const [users, pakets] = await Promise.all([
    prisma.user.findMany({
      include: {
        paket: true,
        _count: {
          select: { undangan: true, transactions: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.paket.findMany({ orderBy: { urutan: "asc" } }),
  ]);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-surface py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-ink">Kelola Users</h1>
              <p className="text-ink-soft mt-2">
                Total: {users.length} pengguna
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
                      User
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-ink">
                      Role
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-ink">
                      Paket
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-ink">
                      Reset PW
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-ink">
                      Terdaftar
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-ink">
                      Hapus
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-line hover:bg-surface transition"
                    >
                      <td className="py-4 px-4">
                        <p className="font-medium text-ink">{user.email}</p>
                        <p className="text-xs text-ink-soft">
                          {user.name || "-"} · {user._count.undangan} undangan ·{" "}
                          {user._count.transactions} transaksi
                        </p>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-4 text-center">
                        <form action={updateUserRoleAction}>
                          <input type="hidden" name="userId" value={user.id} />
                          <input
                            type="hidden"
                            name="role"
                            value={user.role === "admin" ? "user" : "admin"}
                          />
                          <button
                            type="submit"
                            className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                              user.role === "admin"
                                ? "bg-red-100 text-red-800 hover:bg-red-200"
                                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            }`}
                          >
                            {user.role === "admin"
                              ? "Jadikan User"
                              : "Jadikan Admin"}
                          </button>
                        </form>
                      </td>

                      {/* Paket */}
                      <td className="py-4 px-4 text-center">
                        <form action={updateUserPaketAction}>
                          <input type="hidden" name="userId" value={user.id} />
                          <select
                            name="paketId"
                            defaultValue={user.paketId || ""}
                            onChange={(e) => e.currentTarget.form?.requestSubmit()}
                            className="text-xs border border-line rounded px-2 py-1 bg-surface-2 text-ink"
                          >
                            {user.paketId && !pakets.some((p) => p.id === user.paketId) ? (
                              <option value={user.paketId}>
                                {user.paket?.nama}
                              </option>
                            ) : (
                              <option value="">Tanpa paket</option>
                            )}
                            {pakets.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.nama}
                              </option>
                            ))}
                          </select>
                        </form>
                      </td>

                      {/* Reset password */}
                      <td className="py-4 px-4 text-center">
                        <form action={resetUserPasswordAction} className="flex gap-2 justify-center">
                          <input type="hidden" name="userId" value={user.id} />
                          <input
                            type="password"
                            name="password"
                            placeholder="pw baru (min 8)"
                            className="text-xs border border-line rounded px-2 py-1 bg-surface-2 text-ink w-32"
                            required
                          />
                          <button
                            type="submit"
                            className="text-xs text-accent font-semibold hover:underline"
                          >
                            Reset
                          </button>
                        </form>
                      </td>

                      <td className="py-4 px-4 text-center text-ink-soft text-xs">
                        {new Date(user.createdAt).toLocaleDateString("id-ID")}
                      </td>

                      {/* Hapus */}
                      <td className="py-4 px-4 text-center">
                        <form action={deleteUserAction}>
                          <input type="hidden" name="userId" value={user.id} />
                          <button
                            type="submit"
                            disabled={user.id === admin.id}
                            title={
                              user.id === admin.id
                                ? "Tidak bisa hapus akun sendiri"
                                : "Hapus user"
                            }
                            className="text-xs font-semibold text-red-600 hover:text-red-800 hover:underline disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:no-underline"
                          >
                            {user.id === admin.id ? "—" : "Hapus"}
                          </button>
                        </form>
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