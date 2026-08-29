import { Navbar } from "@/components/anyaman/Navbar";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/anyaman/CheckoutForm";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ paketId?: string }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { paketId } = await searchParams;
  if (!paketId) {
    redirect("/harga");
  }

  // Get paket details
  const paket = await prisma.paket.findUnique({
    where: { id: paketId },
    include: { fitur: true },
  });

  if (!paket) {
    redirect("/harga");
  }

  // Get current user
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { paket: true },
  });

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-surface py-16">
        <div className="mx-auto max-w-2xl px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ink">Upgrade Paket</h1>
            <p className="text-ink-soft mt-2">
              Pilih paket yang sesuai dengan kebutuhan Anda
            </p>
          </div>

          {/* Current Paket Info */}
          {user?.paket && (
            <div className="rounded-xl border border-line bg-surface-2 p-6 mb-8">
              <p className="text-sm text-ink-soft">Paket Saat Ini</p>
              <p className="text-lg font-semibold text-ink mt-1">{user.paket.nama}</p>
              {user.paket.harga > 0 && (
                <p className="text-sm text-accent mt-2">
                  Rp{user.paket.harga.toLocaleString("id-ID")}
                </p>
              )}
            </div>
          )}

          {/* Paket Details */}
          <div className="rounded-2xl border-2 border-ink bg-surface-2 p-8 mb-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold text-ink">{paket.nama}</h2>
                <p className="text-ink-soft mt-2">{paket.deskripsi}</p>
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-sm text-ink-soft">Harga</p>
                  {paket.harga === 0 ? (
                    <p className="text-4xl font-bold text-accent mt-1">Gratis</p>
                  ) : (
                    <>
                      <p className="text-4xl font-bold text-ink mt-1">
                        Rp{paket.harga.toLocaleString("id-ID")}
                      </p>
                      <p className="text-xs text-ink-soft mt-2">Pembayaran sekali</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Fitur yang Didapat */}
            <div className="mt-8 pt-8 border-t border-line">
              <p className="font-semibold text-ink mb-4">Fitur yang Didapat:</p>
              <div className="grid gap-2">
                {paket.fitur.slice(0, 5).map((f) => (
                  <div key={f.id} className="flex items-center gap-2">
                    <span className="text-accent">✓</span>
                    <span className="text-sm text-ink">{f.fiturKey}</span>
                  </div>
                ))}
                {paket.fitur.length > 5 && (
                  <p className="text-sm text-ink-soft mt-2">
                    + {paket.fitur.length - 5} fitur lainnya
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <CheckoutForm paket={paket} />
        </div>
      </main>
    </>
  );
}
