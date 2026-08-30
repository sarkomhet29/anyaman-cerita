import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { ipDiizinkan } from "@/lib/cidr";

// Middleware ini jalan di setiap request — security header, rate limiting
// sederhana, proteksi login klien (/dashboard), dan proteksi panel admin
// (/panel-kelola/*) yang cek sesi admin + role + whitelist IP.

// ---------- Rate limiter (in-memory, trafik kecil-menengah) ----------
const requestLog = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 100;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter(
    (t) => now - t < WINDOW_MS
  );
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > MAX_REQUESTS;
}

function ambilSecret(): Uint8Array {
  return new TextEncoder().encode(process.env.SESSION_SECRET || "");
}

async function ambilAdminSession(request: NextRequest) {
  const token = request.cookies.get("admin_session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, ambilSecret());
    if (
      payload.role !== "admin" ||
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string"
    ) {
      return null;
    }
    return { payload, token };
  } catch {
    return null;
  }
}

// ---------- Whitelist IP admin (opsional) ----------

const ADMIN_LOGIN_PATH = "/panel-kelola/login";

function ambilIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

// ---------- Security headers (setara helmet.js) ----------
function pasangSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  );
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }
  return response;
}

export async function middleware(request: NextRequest) {
  const ip = ambilIP(request);
  const pathname = request.nextUrl.pathname;
  const isAdminArea =
    pathname === "/panel-kelola" || pathname.startsWith("/panel-kelola/");

  // 1) Rate limit global untuk /api
  if (pathname.startsWith("/api") && isRateLimited(ip)) {
    return new NextResponse("Terlalu banyak request, coba lagi nanti.", {
      status: 429,
    });
  }

  // 2) Area admin: whitelist IP (jika ADMIN_IP_WHITELIST diisi)
  if (isAdminArea) {
    const diizinkan = ipDiizinkan(
      ip,
      (process.env.ADMIN_IP_WHITELIST || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    );
    // Halaman login tetap bisa diakses, tapi kalau IP tak diizinkan → 403.
    if (!diizinkan) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      // Jangan bocorkan struktur: arahkan ke halaman login (tidak berfungsi utk IP tsb).
      return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
    }
  }

  // 3) API admin harus punya sesi admin
  if (pathname.startsWith("/api/admin")) {
    const admin = await ambilAdminSession(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // 4) Semua route /panel-kelola/* (kecuali halaman login) wajib sesi admin.
  //    Sekaligus perpanjang sesi (sliding window, 60 menit tanpa aktivitas).
  if (isAdminArea && pathname !== ADMIN_LOGIN_PATH) {
    const admin = await ambilAdminSession(request);
    if (!admin) {
      return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
    }

    const sekarangBaru = Math.floor(Date.now() / 1000) + 60 * 60;
    const tokenBaru = await new SignJWT({
      userId: admin.payload.userId,
      email: admin.payload.email,
      role: "admin",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(sekarangBaru)
      .sign(ambilSecret());

    const response = NextResponse.next();
    response.cookies.set("admin_session", tokenBaru, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });
    response.headers.set("Cache-Control", "no-store");
    return pasangSecurityHeaders(response);
  }

  // 5) Proteksi /dashboard (klien) — sesi klien biasa
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("session")?.value;
    const secret = process.env.SESSION_SECRET;
    let valid = false;

    if (token && secret) {
      try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
        valid = typeof payload.userId === "string";
      } catch {
        valid = false;
      }
    }

    if (!valid) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  const response = NextResponse.next();

  return pasangSecurityHeaders(response);
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};