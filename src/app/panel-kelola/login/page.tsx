import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session";
import { AdminLoginForm } from "@/components/anyaman/AdminLoginForm";
import { WovenMark } from "@/components/anyaman/WovenMark";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/panel-kelola");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <WovenMark />
          <span className="text-lg font-semibold text-ink">
            Anyaman Cerita
          </span>
          <span className="rounded-full border border-line px-3 py-1 text-xs font-medium text-ink-soft">
            Panel Kelola
          </span>
        </div>

        <div className="rounded-2xl border border-line bg-surface-2 p-8">
          <h1 className="text-center text-xl font-bold text-ink">
            Masuk Admin
          </h1>
          <div className="mt-6">
            <AdminLoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}