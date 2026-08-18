export function CTASection() {
  return (
    <section id="mulai" className="bg-surface py-24 text-center">
      <div className="mx-auto max-w-xl px-6">
        <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Mulai buat undanganmu hari ini
        </h2>
        <p className="mt-4 text-ink-soft">
          Isi detail acaramu, pilih tema, dan undangan siap dibagikan dalam
          hitungan menit.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="#tema"
            className="rounded-full bg-ink px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-black"
          >
            Coba Buat Gratis
          </a>
          <a
            href="https://wa.me/"
            className="rounded-full border border-line px-8 py-3.5 text-base font-medium text-ink transition-colors hover:border-ink"
          >
            Minta Dibuatkan Admin
          </a>
        </div>
      </div>
    </section>
  );
}
