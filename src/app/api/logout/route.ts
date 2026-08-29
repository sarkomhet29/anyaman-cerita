import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/session";

/**
 * POST /api/logout
 * Hapus cookie sesi dan redirect ke halaman utama
 */
export async function POST() {
  const response = NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), 303);

  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}