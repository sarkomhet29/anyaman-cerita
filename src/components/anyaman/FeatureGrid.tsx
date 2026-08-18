const features = [
  "Ganti tema kapan saja",
  "Nama tamu tanpa batas",
  "Tanpa masa aktif",
  "RSVP & buku ucapan",
  "Terhubung Google Maps",
  "Hitung mundur hari-H",
  "Pengingat kalender",
  "Galeri foto & video",
  "Amplop digital",
  "Musik latar bisa diganti",
  "Susunan acara & love story",
  "Statistik undangan terkirim",
];

export function FeatureGrid() {
  return (
    <section className="bg-surface py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Semua yang kamu butuhkan
          </h2>
        </div>

        <ul className="mx-auto mt-14 grid max-w-3xl gap-x-10 gap-y-4 sm:grid-cols-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-ink">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span className="text-[15px]">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
