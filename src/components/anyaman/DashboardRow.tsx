"use client";

import { useTransition } from "react";
import { ubahStatusAction } from "@/app/dashboard/actions";

type Row = {
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

const formatTanggal = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function DashboardRow({ row }: { row: Row }) {
  const [isPending, startTransition] = useTransition();
  const statusBaru = row.status === "aktif" ? "draft" : "aktif";

  return (
    <div className="grid grid-cols-1 gap-4 border-b border-line px-6 py-5 last:border-b-0 sm:grid-cols-[1.4fr_1fr_1fr_auto] sm:items-center">
      <div>
        <p className="font-medium text-ink">{row.namaUtama}</p>
        <p className="text-sm text-ink-soft">
          {row.jenisAcara} · {formatTanggal.format(row.tanggalAcara)}
        </p>
      </div>

      <div className="text-sm text-ink-soft">
        <span className="text-ink">{row.jumlahHadir}</span> hadir ·{" "}
        <span className="text-ink">{row.jumlahTidakHadir}</span> tidak hadir ·{" "}
        <span className="text-ink">{row.jumlahBelumRespon}</span> belum respon
      </div>

      <span
        className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
          row.status === "aktif"
            ? "bg-surface-2 text-ink"
            : "border border-line text-ink-soft"
        }`}
      >
        {row.status === "aktif" ? "Aktif" : "Draf"}
      </span>

      <div className="flex gap-2">
        <a
          href={`/u/${row.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink hover:border-ink"
        >
          Lihat
        </a>
        <button
          disabled={isPending}
          onClick={() =>
            startTransition(() => {
              ubahStatusAction(row.id, statusBaru);
            })
          }
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
        >
          {isPending ? "..." : row.status === "aktif" ? "Nonaktifkan" : "Aktifkan"}
        </button>
      </div>
    </div>
  );
}
