import { SignJWT, jwtVerify } from "jose";

// Sesi login disimpan sebagai JWT bertanda tangan di cookie httpOnly —
// tidak bisa dibaca/diubah lewat JavaScript di browser, dan tidak butuh
// tabel session terpisah di database.

const COOKIE_NAME = "session";
const UMUR_SESI = "7d";

function ambilSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "SESSION_SECRET belum diatur di .env (minimal 16 karakter acak)."
    );
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  userId: string;
  email: string;
};

export async function buatSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(UMUR_SESI)
    .sign(ambilSecret());
}

export async function verifikasiSessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ambilSecret());
    if (typeof payload.userId !== "string" || typeof payload.email !== "string") {
      return null;
    }
    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
