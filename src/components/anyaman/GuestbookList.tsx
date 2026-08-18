type Ucapan = {
  id: string;
  nama: string;
  kehadiran: string | null;
  ucapan: string | null;
};

export function GuestbookList({ daftar }: { daftar: Ucapan[] }) {
  const denganUcapan = daftar.filter((t) => t.ucapan);

  if (denganUcapan.length === 0) {
    return (
      <p className="text-center text-sm text-ink-soft">
        Belum ada ucapan. Jadilah yang pertama menulis di atas.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {denganUcapan.map((t) => (
        <div key={t.id} className="rounded-2xl border border-line bg-surface px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ink">{t.nama}</span>
            <span className="text-xs text-ink-soft">
              {t.kehadiran === "hadir" ? "Hadir" : "Tidak bisa hadir"}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t.ucapan}</p>
        </div>
      ))}
    </div>
  );
}
