import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../../src/lib/auth";

describe("hash password (poin 6 — tidak pernah plaintext)", () => {
  it("hash berbeda dari plaintext dan berupa bcrypt", async () => {
    const plain = "Admin@12345";
    const hash = await hashPassword(plain);
    expect(hash).not.toBe(plain);
    expect(hash).toMatch(/^\$2[aby]\$\d+\$/);
  });

  it("verifyPassword cocok untuk password benar", async () => {
    const hash = await hashPassword("Admin@12345");
    expect(await verifyPassword("Admin@12345", hash)).toBe(true);
  });

  it("verifyPassword gagal untuk password salah", async () => {
    const hash = await hashPassword("Admin@12345");
    expect(await verifyPassword("Admin@12346", hash)).toBe(false);
  });

  it("hash berbeda untuk password sama (random salt)", async () => {
    const a = await hashPassword("Admin@12345");
    const b = await hashPassword("Admin@12345");
    expect(a).not.toBe(b);
  });
});