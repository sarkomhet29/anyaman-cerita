import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RsvpForm } from "@/components/anyaman/RsvpForm";
import { GuestbookList } from "@/components/anyaman/GuestbookList";

const formatTanggal = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function UndanganPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const undangan = await prisma.undangan.findUnique({
    where: { slug },
    include: { tamu: { orderBy: { createdAt: "desc" } } },
  });

  if (!undangan) {
    notFound();
  }

  const jumlahHadir = undangan.tamu.filter(
    (t: { kehadiran: string | null }) => t.kehadiran === "hadir"
  ).length;

  return (
    <main className="flex-1 bg-surface">
      {/* Header acara */}
      <section className="border-b border-line py-20 text-center">
        <div className="mx-auto max-w-lg px-6">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            {undangan.jenisAcara}
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            {undangan.namaUtama}
          </h1>
          <p className="mt-4 text-ink-soft">
            {formatTanggal.format(undangan.tanggalAcara)}
            {undangan.waktuAcara ? ` · ${undangan.waktuAcara}` : ""}
          </p>
        </div>
      </section>

      {/* Pesan pembuka */}
      {undangan.pesanUndangan && (
        <section className="border-b border-line py-16">
          <div className="mx-auto max-w-md px-6 text-center">
            <p className="text-[15px] leading-relaxed text-ink-soft">
              {undangan.pesanUndangan}
            </p>
          </div>
        </section>
      )}

      {/* Detail lokasi */}
      <section className="border-b border-line bg-surface-2 py-16">
        <div className="mx-auto max-w-md px-6">
          <div className="rounded-2xl border border-line bg-surface px-6 py-6 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
              Lokasi
            </p>
            <p className="mt-2 text-lg font-semibold text-ink">{undangan.lokasi}</p>
            {undangan.alamatLengkap && (
              <p className="mt-1 text-sm text-ink-soft">{undangan.alamatLengkap}</p>
            )}
            {undangan.mapsUrl && (
              <a
                href={undangan.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink hover:border-ink"
              >
                Buka di Google Maps
              </a>
            )}
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section className="border-b border-line py-16">
        <div className="mx-auto max-w-md px-6">
          <h2 className="text-center text-2xl font-bold tracking-tight text-ink">
            Konfirmasi Kehadiran
          </h2>
          {jumlahHadir > 0 && (
            <p className="mt-2 text-center text-sm text-ink-soft">
              {jumlahHadir} orang sudah konfirmasi hadir
            </p>
          )}
          <div className="mt-8">
            <RsvpForm undanganId={undangan.id} slug={undangan.slug} />
          </div>
        </div>
      </section>

      {/* Buku ucapan */}
      <section className="bg-surface-2 py-16">
        <div className="mx-auto max-w-md px-6">
          <h2 className="text-center text-2xl font-bold tracking-tight text-ink">
            Ucapan &amp; Doa
          </h2>
          <div className="mt-8">
            <GuestbookList daftar={undangan.tamu} />
          </div>
        </div>
      </section>
    </main>
  );
}
