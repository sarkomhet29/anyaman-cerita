"use client";

import Link from "next/link";

const themes = [
  { name: "Songket Senja", price: "Rp39.000", value: "songket-senja" },
];

export function ThemeGallery() {
  return (
    <section id="tema" className="bg-surface py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Pilih tema, langsung terlihat hasilnya
          </h2>
          <p className="mt-4 text-ink-soft">
            Semua tema bisa dipakai untuk acara apa saja, dan warnanya bisa
            disesuaikan kapan pun.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {themes.map((theme) => (
            <Link
              key={theme.name}
              href={`/buat?tema=${theme.value}`}
              className="group overflow-hidden rounded-2xl border border-line bg-surface-2 transition-shadow hover:shadow-lg"
            >
              <div className="flex h-48 flex-col items-center justify-center gap-2 bg-surface p-6 text-center">
                <span className="text-lg font-semibold text-ink">{theme.name}</span>
                <span className="font-mono text-xs text-ink-soft">Pratinjau tema</span>
              </div>
              <div className="flex items-center justify-between border-t border-line px-5 py-4">
                <span className="font-mono text-sm text-ink">{theme.price}</span>
                <span className="text-sm font-medium text-accent transition-colors group-hover:text-accent-2">
                  Pakai →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
