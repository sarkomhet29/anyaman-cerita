import { Navbar } from "@/components/anyaman/Navbar";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import { updateContactStatusAction } from "../actions";

export default async function AdminContactPage() {
  try {
    await requireAdmin();
  } catch {
    redirect("/panel-kelola/login");
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const baru = messages.filter((m) => m.status === "baru").length;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-surface py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-ink">Inbox Kontak</h1>
              <p className="text-ink-soft mt-2">
                Total: {messages.length} pesan · {baru} belum dibaca
              </p>
            </div>
            <Link href="/panel-kelola" className="text-accent hover:underline">
              ← Kembali
            </Link>
          </div>

          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="rounded-2xl border border-line bg-surface-2 p-8 text-center text-ink-soft">
                Belum ada pesan masuk.
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`rounded-2xl border p-6 ${
                  m.status === "baru"
                    ? "border-accent bg-accent/5"
                    : "border-line bg-surface-2"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-ink">{m.nama}</p>
                      <a
                        href={`mailto:${m.email}`}
                        className="text-sm text-accent hover:underline"
                      >
                        {m.email}
                      </a>
                      {m.status === "baru" && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-accent/15 text-accent font-semibold">
                          Baru
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-ink mt-1">
                      {m.subjek}
                    </p>
                    <p className="text-sm text-ink-soft mt-2 whitespace-pre-wrap">
                      {m.pesan}
                    </p>
                    <p className="text-xs text-ink-soft mt-3">
                      {new Date(m.createdAt).toLocaleString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <form action={updateContactStatusAction}>
                    <input type="hidden" name="messageId" value={m.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={m.status === "baru" ? "dibaca" : "selesai"}
                    />
                    <button
                      type="submit"
                      className="text-xs px-3 py-1.5 rounded border border-line bg-surface-3 text-ink hover:bg-surface"
                    >
                      {m.status === "baru" ? "Tandai Dibaca" : "Tandai Selesai"}
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