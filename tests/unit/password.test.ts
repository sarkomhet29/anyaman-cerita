import { describe, it, expect } from "vitest";
import { periksaKekuatanPassword } from "../../src/lib/password";

describe("kebijakan password admin", () => {
  it("password kuat diterima", () => {
    expect(periksaKekuatanPassword("Admin@12345")).toEqual({ ok: true });
  });

  it("password < 10 karakter ditolak", () => {
    expect(periksaKekuatanPassword("Aa1!b")).toHaveProperty("ok", false);
  });

  it("tanpa huruf kecil ditolak", () => {
    expect(periksaKekuatanPassword("ADMIN@12345")).toHaveProperty("ok", false);
  });

  it("tanpa huruf besar ditolak", () => {
    expect(periksaKekuatanPassword("admin@12345")).toHaveProperty("ok", false);
  });

  it("tanpa angka ditolak", () => {
    expect(periksaKekuatanPassword("Admin@abcde")).toHaveProperty("ok", false);
  });

  it("tanpa simbol ditolak", () => {
    expect(periksaKekuatanPassword("Admin12345")).toHaveProperty("ok", false);
  });
});