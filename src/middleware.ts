import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Middleware ini jalan di setiap request — tempat pusat untuk security header,
// rate limiting sederhana, dan proteksi login sebelum request sampai ke halaman/API.

// Rate limiter sangat sederhana berbasis memory (cukup untuk trafik kecil-menengah;
// untuk trafik besar sebaiknya pindah ke Redis/Upstash yang juga ada free tier-nya)
const requestLog = new Map<string, number[]>();
const WINDOW_MS = 60_000; // 1 menit
const MAX_REQUESTS = 100; // maksimal 100 request per menit per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter(
    (t) => now - t < WINDOW_MS
  );
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > MAX_REQUESTS;
}

export async function middleware(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";

  if (request.nextUrl.pathname.startsWith("/api") && isRateLimited(ip)) {
    return new NextResponse("Terlalu banyak request, coba lagi nanti.", {
      status: 429,
    });
  }

  // Lindungi /dashboard — wajib punya cookie sesi yang valid, kalau tidak
  // dilempar ke halaman login.
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("session")?.value;
    const secret = process.env.SESSION_SECRET;
    let valid = false;

    if (token && secret) {
      try {
        await jwtVerify(token, new TextEncoder().encode(secret));
        valid = true;
      } catch {
        valid = false;
      }
    }

    if (!valid) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  const response = NextResponse.next();

  // Security headers (fungsinya mirip helmet.js di Express)
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

  return response;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
