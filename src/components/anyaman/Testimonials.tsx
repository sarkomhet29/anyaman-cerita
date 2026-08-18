const testimonials = [
  {
    quote:
      "Prosesnya cepat banget, dan waktu aku minta ubah warna sesuai baju adat, langsung dikerjain tanpa banyak tanya.",
    name: "Ratih & Dimas",
    event: "Pernikahan",
  },
  {
    quote:
      "Tamu dari luar kota jadi gampang lihat lokasi dan jadwal, dan aku bisa pantau siapa saja yang sudah konfirmasi hadir.",
    name: "Keluarga Pak Herman",
    event: "Aqiqah",
  },
  {
    quote:
      "Awalnya cuma iseng coba gratis, tapi hasilnya rapi jadi langsung lanjut aktifkan buat disebar ke saudara.",
    name: "Nadia",
    event: "Ulang Tahun",
  },
];

export function Testimonials() {
  return (
    <section className="bg-surface py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Dipakai untuk ribuan momen
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="rounded-2xl bg-surface-2 p-6">
              <blockquote className="text-[15px] leading-relaxed text-ink">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 text-sm text-ink-soft">
                {t.name} · {t.event}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
