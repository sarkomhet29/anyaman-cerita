// ============================================================
// Rate limiter login admin — in-memory (cukup untuk skala kecil;
// untuk load besar pindah ke Redis/Upstash, struktur panggilan sama).
// Batas: 5x gagal berturut-turut → kunci 15 menit per email+IP.
// ============================================================

type Entri = {
  gagal: number;
  terkunciSampai: number | null;
  total: number;
};

const MAP = new Map<string, Entri>();
const MAKS_GAGAL = 5;
const LOCK_MS = 15 * 60 * 1000; // 15 menit

export type StatusLoginRateLimit = { bolehCoba: boolean; sisa?: number };

function kunci(k: string): string {
  return k.toLowerCase();
}

/** Cek apakah percobaan login masih diizinkan. */
export function cekRateLimitLogin(
  email: string,
  ip: string
): StatusLoginRateLimit {
  const key = kunci(`${email}|${ip}`);
  const entri = MAP.get(key);
  if (!entri) return { bolehCoba: true };

  if (entri.terkunciSampai && entri.terkunciSampai > Date.now()) {
    const sisa = Math.ceil((entri.terkunciSampai - Date.now()) / 1000);
    return { bolehCoba: false, sisa };
  }
  return { bolehCoba: true };
}

/**
 * Catat keberhasilan — reset penghitung. Sekalian kembalikan hitungan total
 * percobaan (dipakai log).
 */
export function catatLoginBerhasil(email: string, ip: string): number {
  const key = kunci(`${email}|${ip}`);
  const entri = MAP.get(key);
  const total = entri?.total ?? 0;
  MAP.delete(key);
  return total + 1;
}

/**
 * Catat kegagalan. Jika gagal beruntun sudah MAKS_GAGAL → kunci key.
 * @returns menit terkunci jika kena lock, selain itu null.
 */
export function catatLoginGagal(
  email: string,
  ip: string
): { jumlah: number; terkunciMenit: number | null } {
  const key = kunci(`${email}|${ip}`);
  const entri = MAP.get(key) ?? { gagal: 0, terkunciSampai: null, total: 0 };
  entri.gagal += 1;
  entri.total += 1;

  let terkunci: number | null = null;
  if (entri.gagal >= MAKS_GAGAL) {
    entri.terkunciSampai = Date.now() + LOCK_MS;
    entri.gagal = 0;
    terkunci = LOCK_MS / 60_000;
  }
  MAP.set(key, entri);
  return { jumlah: entri.total, terkunciMenit: terkunci };
}