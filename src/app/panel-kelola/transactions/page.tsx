import { Navbar } from "@/components/anyaman/Navbar";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import { updateTransactionStatusAction } from "../actions";

export default async function AdminTransactionsPage() {
  try {
    await requireAdmin();
  } catch {
    redirect("/panel-kelola/login");
  }

  const transactions = await prisma.transaction.findMany({
    include: {
      user: true,
      paket: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const LUNAS = ["success", "aktif"]; // Midtrans sukses + manual disetujui

  const stats = {
    total: transactions.length,
    success: transactions.filter((t) => LUNAS.includes(t.status)).length,
    menunggu: transactions.filter((t) => t.status === "menunggu_verifikasi").length,
    pending: transactions.filter((t) => t.status === "pending").length,
    failed: transactions.filter((t) => t.status === "failed").length,
    totalRevenue: transactions
      .filter((t) => LUNAS.includes(t.status))
      .reduce((sum, t) => sum + t.amount, 0),
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-surface py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-ink">Transaksi</h1>
              <p className="text-ink-soft mt-2">
                Total: {stats.total} transaksi
              </p>
            </div>
            <Link href="/panel-kelola" className="text-accent hover:underline">
              ← Kembali
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-5 mb-8">
            <div className="rounded-2xl border border-line bg-surface-2 p-6">
              <p className="text-sm text-ink-soft">Total Transaksi</p>
              <p className="text-2xl font-bold text-ink mt-2">{stats.total}</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface-2 p-6">
              <p className="text-sm text-ink-soft">Lunas</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {stats.success}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface-2 p-6">
              <p className="text-sm text-ink-soft">Menunggu Verifikasi</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {stats.menunggu}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface-2 p-6">
              <p className="text-sm text-ink-soft">Pending / Gagal</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">
                {stats.pending + stats.failed}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface-2 p-6">
              <p className="text-sm text-ink-soft">Total Revenue</p>
              <p className="text-2xl font-bold text-ink mt-2">
                Rp{stats.totalRevenue.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface-2 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line bg-surface-3">
                    <th className="text-left py-4 px-4 font-semibold text-ink">
                      Order ID
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-ink">
                      User
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-ink">
                      Paket
                    </th>
                    <th className="text-right py-4 px-4 font-semibold text-ink">
                      Amount
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-ink">
                      Status
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-ink">
                      Tanggal
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-ink">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-line hover:bg-surface transition"
                    >
                      <td className="py-4 px-4">
                        <p className="font-medium text-ink text-xs font-mono">
                          {tx.orderId}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-ink">{tx.user.email}</p>
                          <p className="text-xs text-ink-soft">
                            {tx.user.name}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-ink-soft">
                        {tx.paket.nama}
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-ink">
                        Rp{tx.amount.toLocaleString("id-ID")}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            tx.status === "success"
                              ? "bg-green-100 text-green-800"
                              : tx.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : tx.status === "expired"
                              ? "bg-gray-200 text-gray-700"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-ink-soft text-xs">
                        {new Date(tx.createdAt).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-4 px-4">
                        {tx.status === "pending" && (
                          <div className="flex justify-end gap-2">
                            <form action={updateTransactionStatusAction}>
                              <input
                                type="hidden"
                                name="transactionId"
                                value={tx.id}
                              />
                              <input
                                type="hidden"
                                name="status"
                                value="success"
                              />
                              <button
                                type="submit"
                                className="text-xs px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                              >
                                Approve
                              </button>
                            </form>
                            <form action={updateTransactionStatusAction}>
                              <input
                                type="hidden"
                                name="transactionId"
                                value={tx.id}
                              />
                              <input
                                type="hidden"
                                name="status"
                                value="failed"
                              />
                              <button
                                type="submit"
                                className="text-xs px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                              >
                                Batalkan
                              </button>
                            </form>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-4 text-xs text-ink-soft">
            Approve transaksi pending otomatis meng-upgrade paket user
            bersangkutan.
          </p>
        </div>
      </main>
    </>
  );
}