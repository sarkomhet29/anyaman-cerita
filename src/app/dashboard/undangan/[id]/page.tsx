import { Navbar } from "@/components/anyaman/Navbar";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

export default async function DetailUndanganPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const undangan = await prisma.undangan.findUnique({
    where: { id },
    include: {
      tamu: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!undangan) {
    notFound();
  }

  // Check ownership
  if (undangan.userId !== session.userId) {
    redirect("/dashboard");
  }

  // Hitung statistik
  const tamuHadir = undangan.tamu.filter((t) => t.kehadiran === "hadir");
  const tamuTidakHadir = undangan.tamu.filter((t) => t.kehadiran === "tidak_hadir");
  const tamuBelumRespon = undangan.tamu.filter((t) => !t.kehadiran);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-surface py-16">
        <div className="mx-auto max-w-4xl px-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <Link href="/dashboard" className="text-sm text-accent hover:underline inline-block">
              ← Kembali ke Dashboard
            </Link>
            <Link
              href={`/dashboard/undangan/${id}/edit`}
              className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white hover:bg-black"
            >
              Edit Undangan
            </Link>
          </div>

          <div className="rounded-2xl border border-line bg-surface-2 p-8 mb-8">
            <h1 className="text-3xl font-bold text-ink">{undangan.namaUtama}</h1>
            <p className="text-ink-soft mt-2">{undangan.jenisAcara}</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs text-ink-soft uppercase">Tanggal Acara</p>
                <p className="font-medium text-ink">
                  {new Date(undangan.tanggalAcara).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-ink-soft uppercase">Lokasi</p>
                <p className="font-medium text-ink">{undangan.lokasi}</p>
              </div>
            </div>
          </div>

          {/* Statistik */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            {/* Hadir */}
            <div className="rounded-2xl border border-line bg-surface p-6">
              <p className="text-sm text-ink-soft">Hadir</p>
              <p className="text-4xl font-bold text-accent mt-2">{tamuHadir.length}</p>
              <p className="text-xs text-ink-soft mt-1">
                dari {undangan.tamu.length} tamu
              </p>
            </div>

            {/* Tidak Hadir */}
            <div className="rounded-2xl border border-line bg-surface p-6">
              <p className="text-sm text-ink-soft">Tidak Hadir</p>
              <p className="text-4xl font-bold text-red-600 mt-2">{tamuTidakHadir.length}</p>
              <p className="text-xs text-ink-soft mt-1">
                {tamuTidakHadir.length > 0 ? "sudah konfirmasi" : "belum ada"}
              </p>
            </div>

            {/* Belum Respon */}
            <div className="rounded-2xl border border-line bg-surface p-6">
              <p className="text-sm text-ink-soft">Belum Respon</p>
              <p className="text-4xl font-bold text-yellow-600 mt-2">
                {tamuBelumRespon.length}
              </p>
              <p className="text-xs text-ink-soft mt-1">
                menunggu konfirmasi
              </p>
            </div>
          </div>

          {/* Daftar Tamu */}
          <div className="space-y-8">
            {/* Hadir */}
            {tamuHadir.length > 0 && (
              <div className="rounded-2xl border border-line bg-surface p-6">
                <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent/10">
                    <span className="text-accent font-bold">✓</span>
                  </span>
                  Tamu yang Hadir ({tamuHadir.length})
                </h3>
                <div className="space-y-3">
                  {tamuHadir.map((tamu) => (
                    <div
                      key={tamu.id}
                      className="flex items-start justify-between p-3 rounded-lg bg-surface-2"
                    >
                      <div>
                        <p className="font-medium text-ink">{tamu.nama}</p>
                        {tamu.ucapan && (
                          <p className="text-sm text-ink-soft mt-1 italic">
                            &quot;{tamu.ucapan}&quot;
                          </p>
                        )}
                      </div>
                      <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                        Hadir
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tidak Hadir */}
            {tamuTidakHadir.length > 0 && (
              <div className="rounded-2xl border border-line bg-surface p-6">
                <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100">
                    <span className="text-red-600 font-bold">✕</span>
                  </span>
                  Tamu yang Tidak Hadir ({tamuTidakHadir.length})
                </h3>
                <div className="space-y-3">
                  {tamuTidakHadir.map((tamu) => (
                    <div
                      key={tamu.id}
                      className="flex items-start justify-between p-3 rounded-lg bg-surface-2"
                    >
                      <div>
                        <p className="font-medium text-ink">{tamu.nama}</p>
                        {tamu.ucapan && (
                          <p className="text-sm text-ink-soft mt-1 italic">
                            &quot;{tamu.ucapan}&quot;
                          </p>
                        )}
                      </div>
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                        Tidak Hadir
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Belum Respon */}
            {tamuBelumRespon.length > 0 && (
              <div className="rounded-2xl border border-line bg-surface p-6">
                <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100">
                    <span className="text-yellow-600 font-bold">?</span>
                  </span>
                  Tamu yang Belum Respon ({tamuBelumRespon.length})
                </h3>
                <div className="space-y-3">
                  {tamuBelumRespon.map((tamu) => (
                    <div
                      key={tamu.id}
                      className="flex items-start justify-between p-3 rounded-lg bg-surface-2"
                    >
                      <div>
                        <p className="font-medium text-ink">{tamu.nama}</p>
                        <p className="text-xs text-ink-soft mt-1">
                          Dimulai: {new Date(tamu.createdAt).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                      <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded">
                        Menunggu
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Jika belum ada tamu */}
            {undangan.tamu.length === 0 && (
              <div className="rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
                <p className="text-ink-soft">Belum ada tamu yang merespons</p>
                <p className="text-sm text-ink-soft mt-2">
                  Bagikan undangan untuk menerima RSVP dari tamu
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
