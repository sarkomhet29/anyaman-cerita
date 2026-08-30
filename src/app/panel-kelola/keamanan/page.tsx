import { Navbar } from "@/components/anyaman/Navbar";
import { AdminNav } from "@/components/anyaman/AdminNav";
import { AdminKeamananClient } from "@/components/anyaman/AdminKeamananClient";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminKeamananPage() {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    redirect("/panel-kelola/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: admin.id },
    select: {
      email: true,
      twoFactorEnabled: true,
      twoFactorSecret: true,
    },
  });
  if (!user) redirect("/panel-kelola/login");

  const riwayat = await prisma.loginLog.findMany({
    where: { userId: admin.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <>
      <Navbar />
      <AdminNav active="keamanan" />
      <main className="flex-1 bg-surface py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ink">Keamanan</h1>
            <p className="text-ink-soft mt-2">
              {user.email} · 2FA, password, dan riwayat login.
            </p>
          </div>

          <AdminKeamananClient
            adminEmail={user.email}
            twoFactorEnabled={user.twoFactorEnabled}
            twoFactorSecret={user.twoFactorSecret}
          />

          {/* Riwayat login */}
          <div className="mt-6 rounded-2xl border border-line bg-surface-2 p-6">
            <h2 className="text-lg font-bold text-ink mb-4">
              Riwayat Login Anda
            </h2>
            {riwayat.length === 0 ? (
              <p className="text-sm text-ink-soft">
                Belum ada riwayat login tercatat.
              </p>
            ) : (
              <div className="space-y-3">
                {riwayat.map((log) => (
                  <div
                    key={log.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-surface px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex h-2.5 w-2.5 rounded-full ${
                          log.status === "success" ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <span className="text-sm font-medium text-ink">
                        {log.status === "success" ? "Berhasil" : "Gagal"}
                      </span>
                      {log.reason && (
                        <span className="text-xs text-ink-soft">{log.reason}</span>
                      )}
                    </div>
                    <div className="text-right text-xs text-ink-soft">
                      <p>{log.ip}</p>
                      <p>{log.createdAt.toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}