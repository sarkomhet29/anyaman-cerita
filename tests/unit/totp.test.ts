import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  generateTOTPSecret,
  verifikasiTOTP,
  kodeTOTPSaatIni,
  urlOtpauth,
} from "../../src/lib/totp";

// Verifikasi kode TOTP: benar, salah, kadaluarsa (di luar toleransi window).

describe("TOTP 2FA admin (poin 5 — logika)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  const secret = generateTOTPSecret();

  it("generateTOTPSecret menghasilkan Base32 32 karakter", () => {
    expect(secret).toMatch(/^[A-Z2-7]{32}$/);
  });

  it("kode benar diverifikasi OK", () => {
    const kode = kodeTOTPSaatIni(secret);
    expect(verifikasiTOTP(secret, kode)).toBe(true);
  });

  it("kode salah ditolak", () => {
    expect(verifikasiTOTP(secret, "000000")).toBe(false);
  });

  it("kode non-6-digit ditolak", () => {
    expect(verifikasiTOTP(secret, "12345")).toBe(false);
    expect(verifikasiTOTP(secret, "abcdef")).toBe(false);
  });

  it("toleransi ±1 step: kode 1 step lalu/lagi masih diterima", () => {
    expect(verifikasiTOTP(secret, kodeTOTPSaatIni(secret, -1))).toBe(true);
    expect(verifikasiTOTP(secret, kodeTOTPSaatIni(secret, 1))).toBe(true);
  });

  it("kode di luar window (2+ step) ditolak = kadaluarsa", () => {
    expect(verifikasiTOTP(secret, kodeTOTPSaatIni(secret, -2))).toBe(false);
    expect(verifikasiTOTP(secret, kodeTOTPSaatIni(secret, 5))).toBe(false);
  });

  it("kode sudah usang parah (banyak step) ditolak", () => {
    vi.setSystemTime(new Date("2020-01-01T00:00:00Z"));
    const kodeLama = kodeTOTPSaatIni(secret);
    vi.setSystemTime(new Date("2025-01-01T00:00:00Z"));
    expect(verifikasiTOTP(secret, kodeLama)).toBe(false);
  });

  it("urlOtpauth mengandung secret & label", () => {
    const url = urlOtpauth(secret, "admin@test.local");
    expect(url).toContain("otpauth://totp/");
    expect(url).toContain(`secret=${secret}`);
    expect(url).toContain("Anyaman%20Cerita");
  });
});