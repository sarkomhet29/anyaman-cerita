import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Sesi login disimpan sebagai JWT bertanda tangan di cookie httpOnly —
// tidak bisa dibaca/diubah lewat JavaScript di browser, dan tidak butuh
// tabel session terpisah di database.

const COOKIE_NAME = "session";
const UMUR_SESI = "7d";

// Sesi khusus admin — cookie terpisah dari sesi klien. HSL sedikit lebih
// ketat: hanya 30-60 menit, dan di-refresh terus selama ada aktivitas
// (sliding window) di middleware.
const ADMIN_COOKIE_NAME = "admin_session";
const UMUR_ADMIN_SESI = "60m";

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

export type AdminSessionPayload = {
  userId: string;
  email: string;
  role: "admin";
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

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifikasiSessionToken(token);
}

// ------------------------------------------------------------
// Sesi admin (cookie terpisah, masa aktif 60 menit, sliding)
// ------------------------------------------------------------

export async function buatAdminSessionToken(
  payload: SessionPayload
): Promise<string> {
  return new SignJWT({ ...payload, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(UMUR_ADMIN_SESI)
    .sign(ambilSecret());
}

/** Verifikasi token admin; tolak jika claim role bukan "admin". */
export async function verifikasiAdminSessionToken(
  token: string
): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ambilSecret());
    if (
      payload.role !== "admin" ||
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string"
    ) {
      return null;
    }
    return { userId: payload.userId, email: payload.email, role: "admin" };
  } catch {
    return null;
  }
}

/** Baca sesi admin dari cookie. Server-side; untuk halaman/action/API. */
export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifikasiAdminSessionToken(token);
}

/** Token admin yang sudah dipakai ulang untuk perpanjang (sliding window). */
export async function perbaruiAdminSession(
  token: string
): Promise<string | null> {
  const payload = await verifikasiAdminSessionToken(token);
  if (!payload) return null;
  return buatAdminSessionToken(payload);
}

export { COOKIE_NAME, ADMIN_COOKIE_NAME };