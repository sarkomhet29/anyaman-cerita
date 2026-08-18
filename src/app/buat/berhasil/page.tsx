import { Navbar } from "@/components/anyaman/Navbar";
import { Footer } from "@/components/anyaman/Footer";

export default async function BerhasilPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const { slug } = await searchParams;

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center bg-surface py-24">
        <div className="mx-auto max-w-md px-6 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-surface-2 text-2xl">
            ✓
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">
            Undangan berhasil dibuat
          </h1>
          <p className="mt-3 text-ink-soft">
            Undanganmu masih berstatus draf dan hanya bisa dilihat olehmu.
            Aktifkan dulu untuk membagikannya ke tamu.
          </p>

          {slug && (
            <div className="mt-8 rounded-xl border border-line bg-surface-2 px-5 py-4 text-left">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
                Link undangan
              </p>
              <p className="mt-1 break-all font-mono text-sm text-ink">
                anyamancerita.id/u/{slug}
              </p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#"
              className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-white hover:bg-black"
            >
              Lihat Undangan
            </a>
            <a
              href="/buat"
              className="rounded-full border border-line px-6 py-3 text-sm font-medium text-ink hover:border-ink"
            >
              Buat Undangan Lain
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
