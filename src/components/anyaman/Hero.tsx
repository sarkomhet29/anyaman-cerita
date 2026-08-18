import { ThreadMark } from "./WovenMark";

export function Hero() {
  return (
    <section className="bg-surface pt-24 pb-16 text-center sm:pt-32 sm:pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mx-auto mb-6 flex justify-center">
          <ThreadMark />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-6xl">
          Undangan digital,
          <br />
          dibuat semudah mengetik.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
          Isi nama, tanggal, dan lokasi acaramu. Anyaman Cerita menyusun
          sisanya jadi undangan yang rapi dan gampang dibaca siapa pun.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#mulai"
            className="rounded-full bg-ink px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-black"
          >
            Coba Buat Gratis
          </a>
          <a
            href="#tema"
            className="rounded-full border border-line px-8 py-3.5 text-base font-medium text-ink transition-colors hover:border-ink"
          >
            Lihat Contoh
          </a>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-2xl px-6">
        <InvitationPreview />
      </div>
    </section>
  );
}

// A single, clean preview card — the product itself is the hero image,
// not decoration around it.
function InvitationPreview() {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-surface-2 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-2 border-b border-line px-5 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-[11px] text-ink-soft">
          anyamancerita.id/ayu-bagas
        </span>
      </div>
      <div className="flex flex-col items-center gap-3 px-8 py-16">
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
          Undangan Pernikahan
        </span>
        <h2 className="text-3xl font-bold text-ink sm:text-4xl">Ayu &amp; Bagas</h2>
        <p className="text-ink-soft">Sabtu, 12 Oktober 2026</p>
        <a
          href="#"
          className="mt-6 rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white"
        >
          Buka Undangan
        </a>
      </div>
    </div>
  );
}
