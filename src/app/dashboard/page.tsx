import { prisma } from "@/lib/prisma";
import { DashboardRow } from "@/components/anyaman/DashboardRow";
import { logoutAction } from "@/app/login/actions";

type DashboardRowData = {
  id: string;
  slug: string;
  namaUtama: string;
  jenisAcara: string;
  tanggalAcara: Date;
  status: string;
  jumlahHadir: number;
  jumlahTidakHadir: number;
  jumlahBelumRespon: number;
};

export default async function DashboardPage() {
  const daftarUndangan = await prisma.undangan.findMany({
    include: { tamu: true },
    orderBy: { createdAt: "desc" },
  });

  const rows: DashboardRowData[] = daftarUndangan.map(
    (u: {
      id: string;
      slug: string;
      namaUtama: string;
      jenisAcara: string;
      tanggalAcara: Date;
      status: string;
      tamu: { kehadiran: string | null }[];
    }) => ({
      id: u.id,
      slug: u.slug,
      namaUtama: u.namaUtama,
      jenisAcara: u.jenisAcara,
      tanggalAcara: u.tanggalAcara,
      status: u.status,
      jumlahHadir: u.tamu.filter((t) => t.kehadiran === "hadir").length,
      jumlahTidakHadir: u.tamu.filter((t) => t.kehadiran === "tidak_hadir").length,
      jumlahBelumRespon: u.tamu.filter((t) => !t.kehadiran).length,
    })
  );

  const totalAktif = rows.filter((r: DashboardRowData) => r.status === "aktif").length;

  return (
    <main className="flex-1 bg-surface py-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-ink">Dashboard</h1>
            <p className="mt-1 text-ink-soft">
              {rows.length} undangan dibuat · {totalAktif} aktif
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/buat"
              className="w-fit rounded-full bg-ink px-6 py-3 text-sm font-medium text-white hover:bg-black"
            >
              + Buat Undangan
            </a>
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-fit rounded-full border border-line px-6 py-3 text-sm font-medium text-ink hover:border-ink"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-line">
          {rows.length === 0 ? (
            <p className="px-6 py-12 text-center text-ink-soft">
              Belum ada undangan. Klik &ldquo;Buat Undangan&rdquo; untuk mulai.
            </p>
          ) : (
            rows.map((row: DashboardRowData) => <DashboardRow key={row.id} row={row} />)
          )}
        </div>
      </div>
    </main>
  );
}
