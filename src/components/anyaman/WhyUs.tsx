const rows = [
  {
    title: "Ubah nama tamu tanpa batas",
    body: "Kirim ke berapa pun tamu, masing-masing melihat namanya sendiri di undangan — tanpa biaya tambahan.",
  },
  {
    title: "Tidak pernah kedaluwarsa",
    body: "Undangan tetap bisa dibuka dan diedit kapan pun, sebelum maupun sesudah hari-H.",
  },
  {
    title: "RSVP dan ucapan langsung masuk",
    body: "Tamu konfirmasi kehadiran dan menulis ucapan dari undangan. Kamu pantau semuanya dari satu halaman.",
  },
];

export function WhyUs() {
  return (
    <section id="kenapa" className="bg-surface-2 py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Dibuat serius, dipakai dengan mudah
        </h2>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-8 px-6 sm:grid-cols-3">
        {rows.map((row) => (
          <div key={row.title} className="rounded-2xl bg-surface p-8 text-left">
            <h3 className="text-lg font-semibold text-ink">{row.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{row.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
