import { Navbar } from "@/components/anyaman/Navbar";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboardPage() {
  try {
    await requireAdmin();
  } catch {
    redirect("/login");
  }

  // Get statistics
  const [totalUsers, totalTransactions, totalRevenue, recentTransactions, totalUndangan, newMessages] =
    await Promise.all([
      prisma.user.count(),
      prisma.transaction.count({ where: { status: "success" } }),
      prisma.transaction.aggregate({
        where: { status: "success" },
        _sum: { amount: true },
      }),
      prisma.transaction.findMany({
        where: { status: "success" },
        include: { user: true, paket: true },
        orderBy: { paidAt: "desc" },
        take: 10,
      }),
      prisma.undangan.count(),
      prisma.contactMessage.count({ where: { status: "baru" } }),
    ]);

  const totalRevenueAmount = totalRevenue._sum.amount ?? recentTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-surface py-16">
        <div className="mx-auto max-w-7xl px-6">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-ink">Admin Dashboard</h1>
            <p className="text-ink-soft mt-2">Kelola users, transaksi, dan sistem</p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-4 mb-12">
            <div className="rounded-2xl border border-line bg-surface-2 p-6">
              <p className="text-sm text-ink-soft">Total Users</p>
              <p className="text-3xl font-bold text-ink mt-2">{totalUsers}</p>
            </div>

            <div className="rounded-2xl border border-line bg-surface-2 p-6">
              <p className="text-sm text-ink-soft">Transaksi Sukses</p>
              <p className="text-3xl font-bold text-accent mt-2">
                {totalTransactions}
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-surface-2 p-6">
              <p className="text-sm text-ink-soft">Total Revenue</p>
              <p className="text-3xl font-bold text-ink mt-2">
                Rp{totalRevenueAmount.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-surface-2 p-6">
              <p className="text-sm text-ink-soft">Avg Transaction</p>
              <p className="text-3xl font-bold text-ink mt-2">
                {totalTransactions > 0
                  ? `Rp${Math.round(totalRevenueAmount / totalTransactions).toLocaleString("id-ID")}`
                  : "Rp0"}
              </p>
            </div>
          </div>

          {/* Admin Menu */}
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <Link
              href="/admin/users"
              className="rounded-2xl border border-line bg-surface-2 p-6 hover:border-accent transition-colors"
            >
              <div className="text-3xl mb-3">👥</div>
              <h3 className="font-semibold text-ink">Kelola Users</h3>
              <p className="text-sm text-ink-soft mt-2">
                Ubah role, paket, reset password, hapus user
              </p>
            </Link>

            <Link
              href="/admin/transactions"
              className="rounded-2xl border border-line bg-surface-2 p-6 hover:border-accent transition-colors"
            >
              <div className="text-3xl mb-3">💳</div>
              <h3 className="font-semibold text-ink">Transaksi</h3>
              <p className="text-sm text-ink-soft mt-2">
                Approve/batalkan pembayaran dan upgrade paket
              </p>
            </Link>

            <Link
              href="/admin/paket"
              className="rounded-2xl border border-line bg-surface-2 p-6 hover:border-accent transition-colors"
            >
              <div className="text-3xl mb-3">📦</div>
              <h3 className="font-semibold text-ink">Paket</h3>
              <p className="text-sm text-ink-soft mt-2">
                Tambah, edit, hapus paket berlangganan
              </p>
            </Link>

            <Link
              href="/admin/undangan"
              className="rounded-2xl border border-line bg-surface-2 p-6 hover:border-accent transition-colors"
            >
              <div className="text-3xl mb-3">🎉</div>
              <h3 className="font-semibold text-ink">Undangan</h3>
              <p className="text-sm text-ink-soft mt-2">
                Moderasi semua undangan client ({totalUndangan})
              </p>
            </Link>

            <Link
              href="/admin/contact"
              className="rounded-2xl border border-line bg-surface-2 p-6 hover:border-accent transition-colors"
            >
              <div className="text-3xl mb-3">✉️</div>
              <h3 className="font-semibold text-ink">Inbox Kontak</h3>
              <p className="text-sm text-ink-soft mt-2">
                Pesan support dari pengunjung
                {newMessages > 0 && (
                  <span className="ml-2 inline-block rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white">
                    {newMessages} baru
                  </span>
                )}
              </p>
            </Link>
          </div>

          {/* Recent Transactions */}
          <div className="rounded-2xl border border-line bg-surface-2 p-8">
            <h2 className="text-xl font-bold text-ink mb-6">
              Transaksi Terbaru
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th className="text-left py-3 px-4 font-semibold text-ink">
                      User
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-ink">
                      Paket
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-ink">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-ink">
                      Tanggal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-line hover:bg-surface">
                      <td className="py-3 px-4">
                        <p className="font-medium text-ink">{tx.user.email}</p>
                      </td>
                      <td className="py-3 px-4 text-ink-soft">
                        {tx.paket.nama}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-ink">
                        Rp{tx.amount.toLocaleString("id-ID")}
                      </td>
                      <td className="py-3 px-4 text-ink-soft">
                        {tx.paidAt
                          ? new Date(tx.paidAt).toLocaleDateString("id-ID")
                          : "-"}
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
