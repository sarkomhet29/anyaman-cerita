// ============================================================
// TOTP (RFC 6238) — kompatibel dengan Google Authenticator dkk.
// Tanpa dependency: pakai node:crypto langsung (HMAC-SHA1).
// ============================================================
import { createHmac, randomBytes } from "crypto";

const ALFABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const STEP_MS = 30_000;
const DIGIT = 6;

function base32Encode(buf: Buffer): string {
  let bit = 0;
  let value = 0;
  let out = "";
  for (const byte of buf) {
    value = (value << 8) | byte;
    bit += 8;
    while (bit >= 5) {
      out += ALFABET[(value >>> (bit - 5)) & 0x1f];
      bit -= 5;
    }
  }
  if (bit > 0) out += ALFABET[(value << (5 - bit)) & 0x1f];
  return out;
}

function base32Decode(input: string): Buffer {
  const bersih = input.toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bit = 0;
  let value = 0;
  const bytes: number[] = [];
  for (const ch of bersih) {
    const idx = ALFABET.indexOf(ch);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bit += 5;
    if (bit >= 8) {
      bytes.push((value >>> (bit - 8)) & 0xff);
      bit -= 8;
    }
  }
  return Buffer.from(bytes);
}

function kodeTOTP(secret: string, step: number): string {
  const key = base32Decode(secret);
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(step));
  const h = createHmac("sha1", key).update(buf).digest();
  const o = h[h.length - 1] & 0x0f;
  const bin =
    ((h[o] & 0x7f) << 24) |
    ((h[o + 1] & 0xff) << 16) |
    ((h[o + 2] & 0xff) << 8) |
    (h[o + 3] & 0xff);
  return (bin % 10 ** DIGIT).toString().padStart(DIGIT, "0");
}

/** Generate secret TOTP baru (160-bit, Base32). */
export function generateTOTPSecret(): string {
  return base32Encode(randomBytes(20));
}

/** Kode TOTP saat ini (dengan offset step, untuk verifikasi/test). */
export function kodeTOTPSaatIni(secret: string, offsetStep = 0): string {
  const step = Math.floor(Date.now() / STEP_MS) + offsetStep;
  return kodeTOTP(secret, step);
}

/** Verifikasi kode 6 digit dengan toleransi ±`window` step (default ±1 = 30 detik). */
export function verifikasiTOTP(
  secret: string,
  token: string,
  window = 1
): boolean {
  if (!/^\d{6}$/.test(token)) return false;
  const stepSekarang = Math.floor(Date.now() / STEP_MS);
  for (let i = -window; i <= window; i++) {
    if (kodeTOTP(secret, stepSekarang + i) === token) return true;
  }
  return false;
}

/** URL otpauth:// untuk dipindai Google Authenticator / app TOTP lain. */
export function urlOtpauth(secret: string, label: string): string {
  return `otpauth://totp/Anyaman%20Cerita:${encodeURIComponent(
    label
  )}?secret=${secret}&issuer=Anyaman%20Cerita&period=30&digits=${DIGIT}`;
}