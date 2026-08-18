// Ubah teks bebas jadi slug URL yang aman, lalu tambahkan akhiran acak
// pendek supaya tidak bentrok kalau ada dua undangan dengan nama sama.
export function buatSlug(teks: string): string {
  const dasar = teks
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  const acak = Math.random().toString(36).slice(2, 6);
  return `${dasar}-${acak}`;
}
