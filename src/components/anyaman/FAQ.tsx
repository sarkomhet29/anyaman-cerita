"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Apa itu undangan digital?",
    a: "Undangan berbentuk halaman web yang bisa dibagikan lewat link, berisi detail acara, lokasi, dan cara konfirmasi kehadiran — tanpa perlu cetak fisik.",
  },
  {
    q: "Beneran bisa coba gratis?",
    a: "Bisa. Kamu bisa buat dan lihat hasil undangan secara gratis. Untuk membagikannya ke tamu tanpa watermark, undangan perlu diaktifkan lebih dulu.",
  },
  {
    q: "Setelah aktif, undangan masih bisa diedit?",
    a: "Bisa kapan saja, termasuk mengganti nama tamu, foto, atau susunan acara, bahkan setelah undangan disebar.",
  },
  {
    q: "Bagaimana kalau saya ingin tema custom?",
    a: "Kirim referensi warna atau motif yang kamu inginkan, tim kami akan menyesuaikan salah satu tema yang ada atau membuatkan yang baru.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-surface-2 py-24">
      <div className="mx-auto max-w-2xl px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Yang sering ditanyakan
        </h2>

        <div className="mt-12 divide-y divide-line rounded-2xl border border-line bg-surface">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-ink">{item.q}</span>
                  <span
                    className={`shrink-0 text-xl text-ink-soft transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <p className="px-6 pb-5 text-sm leading-relaxed text-ink-soft">{item.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
