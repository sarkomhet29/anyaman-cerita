import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  cekRateLimitLogin,
  catatLoginBerhasil,
  catatLoginGagal,
} from "../../src/lib/rate-limit";

// Rate limiter login: 5x gagal beruntun per email+IP → kunci 15 menit.
// Map in-memory di-module-level: reset antar-test via fake timers.

describe("rate limit login admin (poin 4)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("5x gagal berturut-turut → kunci 15 menit", () => {
    let hasil: ReturnType<typeof catatLoginGagal>;
    for (let i = 1; i <= 5; i++) {
      hasil = catatLoginGagal("admin@test.local", "1.2.3.4");
    }
    expect(hasil!.terkunciMenit).toBe(15);
    expect(cekRateLimitLogin("admin@test.local", "1.2.3.4").bolehCoba).toBe(
      false
    );
  });

  it("percobaan ke-6 dan seterusnya diblokir selama masa kunci", () => {
    for (let i = 0; i < 5; i++) catatLoginGagal("admin@test.local", "1.2.3.4");
    const coba6 = cekRateLimitLogin("admin@test.local", "1.2.3.4");
    expect(coba6.bolehCoba).toBe(false);
    expect(coba6.sisa).toBeGreaterThan(0);
  });

  it("setelah 15 menit, lock berakhir dan login bisa dicoba lagi", () => {
    for (let i = 0; i < 5; i++) catatLoginGagal("admin@test.local", "1.2.3.4");
    expect(cekRateLimitLogin("admin@test.local", "1.2.3.4").bolehCoba).toBe(
      false
    );

    vi.advanceTimersByTime(15 * 60 * 1000);
    expect(cekRateLimitLogin("admin@test.local", "1.2.3.4").bolehCoba).toBe(
      true
    );
  });

  it("lock berbasis per email+IP: IP lain tetap bisa mencoba", () => {
    for (let i = 0; i < 5; i++) catatLoginGagal("admin@test.local", "1.2.3.4");
    expect(cekRateLimitLogin("admin@test.local", "1.2.3.5").bolehCoba).toBe(
      true
    );
  });

  it("lock berbasis per email+IP: email lain tetap bisa mencoba dari IP sama", () => {
    for (let i = 0; i < 5; i++) catatLoginGagal("admin@test.local", "1.2.3.4");
    expect(cekRateLimitLogin("admin2@test.local", "1.2.3.4").bolehCoba).toBe(
      true
    );
  });

  it("email tak dikenal juga ikut dihitung (anti user-enumeration lewat lockout)", () => {
    for (let i = 0; i < 5; i++)
      catatLoginGagal("tidakada@test.local", "9.9.9.9");
    expect(cekRateLimitLogin("tidakada@test.local", "9.9.9.9").bolehCoba).toBe(
      false
    );
  });

  it("login sukses mereset penghitung gagal", () => {
    for (let i = 0; i < 4; i++) catatLoginGagal("admin@test.local", "1.2.3.4");
    catatLoginBerhasil("admin@test.local", "1.2.3.4");
    expect(cekRateLimitLogin("admin@test.local", "1.2.3.4").bolehCoba).toBe(
      true
    );
  });

  it("key case-insensitive untuk email", () => {
    for (let i = 0; i < 5; i++)
      catatLoginGagal("ADMIN@TEST.LOCAL", "1.2.3.4");
    expect(cekRateLimitLogin("admin@test.local", "1.2.3.4").bolehCoba).toBe(
      false
    );
  });
});