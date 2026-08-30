import { describe, it, expect } from "vitest";
import { ipDalamCidr, ipDiizinkan } from "../../src/lib/cidr";

describe("whitelist IP admin (CIDR)", () => {
  it("cocok persis untuk single IP", () => {
    expect(ipDalamCidr("192.168.1.10", "192.168.1.10")).toBe(true);
    expect(ipDalamCidr("192.168.1.11", "192.168.1.10")).toBe(false);
  });

  it("cocok dalam /24", () => {
    expect(ipDalamCidr("192.168.1.5", "192.168.1.0/24")).toBe(true);
    expect(ipDalamCidr("192.168.2.5", "192.168.1.0/24")).toBe(false);
  });

  it("cocok dalam /16", () => {
    expect(ipDalamCidr("10.20.30.40", "10.20.0.0/16")).toBe(true);
    expect(ipDalamCidr("10.21.30.40", "10.20.0.0/16")).toBe(false);
  });

  it("tidak valid (bukan IPv4) ditolak", () => {
    expect(ipDalamCidr("999.1.1.1", "192.168.1.0/24")).toBe(false);
    expect(ipDalamCidr("abc", "192.168.1.0/24")).toBe(false);
  });

  it("list kosong = semua diizinkan", () => {
    expect(ipDiizinkan("10.0.0.1", [])).toBe(true);
  });

  it("list campuran: salah satu aturan cocok → diizinkan", () => {
    expect(ipDiizinkan("10.0.0.9", ["192.168.1.0/24", "10.0.0.0/8"])).toBe(true);
    expect(ipDiizinkan("8.8.8.8", ["192.168.1.0/24", "10.0.0.0/8"])).toBe(false);
  });
});