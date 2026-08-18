const events = [
  "Pernikahan",
  "Khitanan",
  "Aqiqah",
  "Ulang Tahun",
  "Wisuda",
  "Syukuran",
  "Acara Custom",
];

export function EventTypes() {
  return (
    <section className="border-y border-line bg-surface-2 py-8">
      <div className="mx-auto max-w-5xl px-6">
        <div className="scrollbar-hide flex justify-center gap-3 overflow-x-auto">
          {events.map((event) => (
            <span
              key={event}
              className="shrink-0 rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink whitespace-nowrap"
            >
              {event}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
