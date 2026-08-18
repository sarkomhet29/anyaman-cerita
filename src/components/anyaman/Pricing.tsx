const tiers = [
  {
    name: "Uji Coba",
    price: "Rp0",
    note: "Coba semua tema, watermark masih tampil",
    features: ["Akses semua tema", "Ubah nama tamu", "1 kali revisi"],
    highlight: false,
  },
  {
    name: "Dasar",
    price: "Rp39.000",
    note: "Tanpa musik dan galeri foto",
    features: ["Semua di Uji Coba", "Tanpa watermark", "RSVP & ucapan", "2 kali revisi"],
    highlight: false,
  },
  {
    name: "Lengkap",
    price: "Rp69.000",
    note: "Pilihan favorit",
    features: ["Semua di Dasar", "10 foto galeri", "Musik latar custom", "Revisi tanpa batas"],
    highlight: true,
  },
  {
    name: "Premium",
    price: "Rp119.000",
    note: "Semua fitur, tanpa batas",
    features: ["Semua di Lengkap", "20 foto galeri HD", "Live streaming", "Domain sendiri"],
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="harga" className="bg-surface-2 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Harga yang jelas, tanpa kejutan
          </h2>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-2xl p-7 ${
                tier.highlight
                  ? "border-2 border-ink bg-surface"
                  : "border border-line bg-surface"
              }`}
            >
              {tier.highlight && (
                <span className="mb-3 w-fit rounded-full bg-ink px-3 py-1 text-[11px] font-medium text-white">
                  Paling Dipilih
                </span>
              )}
              <span className="text-sm font-medium text-ink-soft">{tier.name}</span>
              <span className="mt-2 text-3xl font-bold text-ink">{tier.price}</span>
              <p className="mt-2 text-sm text-ink-soft">{tier.note}</p>
              <ul className="mt-6 space-y-3 text-sm text-ink">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-accent">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#mulai"
                className={`mt-8 rounded-full px-5 py-3 text-center text-sm font-medium transition-colors ${
                  tier.highlight
                    ? "bg-ink text-white hover:bg-black"
                    : "border border-line text-ink hover:border-ink"
                }`}
              >
                Pilih {tier.name}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
