import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { SignJWT, jwtVerify } from "jose";
import {
  buatAdminSessionToken,
  verifikasiAdminSessionToken,
} from "../../src/lib/session";

const SECRET = "kunci_test_acak_panjang_di_atas_16_karakter!!";
const encode = new TextEncoder();
const secretBytes = encode.encode(SECRET);

describe("sesi admin (JWT)", () => {
  const OLD = process.env.SESSION_SECRET;

  beforeAll(() => {
    process.env.SESSION_SECRET = SECRET;
  });
  afterAll(() => {
    if (OLD === undefined) delete process.env.SESSION_SECRET;
    else process.env.SESSION_SECRET = OLD;
  });

  it("token admin valid berisi claim userId/email/role", async () => {
    const token = await buatAdminSessionToken({
      userId: "u1",
      email: "admin@test.local",
    });
    const payload = await verifikasiAdminSessionToken(token);
    expect(payload).toEqual({
      userId: "u1",
      email: "admin@test.local",
      role: "admin",
    });
  });

  it("token dengan claim role 'user' DITOLAK oleh verifikasi admin", async () => {
    const { payload } = await jwtVerify(
      await new SignJWT({
        userId: "u2",
        email: "user@test.local",
        role: "user",
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(secretBytes),
      secretBytes
    );
    expect(payload.role).toBe("user");

    const token = await new SignJWT({
      userId: "u2",
      email: "user@test.local",
      role: "user",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secretBytes);

    expect(await verifikasiAdminSessionToken(token)).toBeNull();
  });

  it("token dengan signature salah ditolak", async () => {
    const token = await new SignJWT({
      userId: "u3",
      email: "admin@test.local",
      role: "admin",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(encode.encode("kunci_salah_salah_salah_salah!!"));

    expect(await verifikasiAdminSessionToken(token)).toBeNull();
  });

  it("token kadaluarsa ditolak", async () => {
    const token = await new SignJWT({
      userId: "u4",
      email: "admin@test.local",
      role: "admin",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) - 60)
      .sign(secretBytes);

    expect(await verifikasiAdminSessionToken(token)).toBeNull();
  });
});