"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import {
  buatAdminSessionToken,
  ADMIN_COOKIE_NAME,
} from "@/lib/session";
import {
  cekRateLimitLogin,
  catatLoginBerhasil,
  catatLoginGagal,
} from "@/lib/rate-limit";
import { verifikasiTOTP } from "@/lib/totp";
import {
  ambilIPFromHeaders,
  ambilUserAgentFromHeaders,
} from "@/lib/request-meta";

export type AdminLoginState = {
  error: string | null;
  perlu2FA: boolean;
  emailTerakhir: string;
};

const AWAL: AdminLoginState = { error: null, perlu2FA: false, emailTerakhir: "" };

async function catatLogin({
  email,
  userId,
  status,
  reason,
}: {
  email: string;
  userId?: string;
  status: "success" | "failed";
  reason?: string;
}) {
  const store = await headers();
  await prisma.loginLog.create({
    data: {
      email,
      userId: userId || null,
      ip: ambilIPFromHeaders(store),
      userAgent: ambilUserAgentFromHeaders(store),
      status,
      reason: reason || null,
    },
  });
}

export async function adminLoginAction(
  _prev: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const kode2FA = String(formData.get("kode2fa") || "").trim();

  const store = await headers();
  const ip = ambilIPFromHeaders(store);

  if (!email || !password) {
    return {
      ...AWAL,
      emailTerakhir: email,
      error: "Email dan password wajib diisi.",
    };
  }

  // 1) Rate limit (5x gagal berturut-turut → kunci 15 menit per email+IP)
  const st = cekRateLimitLogin(email, ip);
  if (!st.bolehCoba) {
    await catatLogin({ email, status: "failed", reason: "terkunci rate limit" });
    const menit = Math.max(1, Math.ceil((st.sisa ?? 0) / 60));
    return {
      ...AWAL,
      emailTerakhir: email,
      error: `Terlalu banyak percobaan gagal. Coba lagi ${menit} menit lagi.`,
    };
  }

  // 2) Cari akun admin saja — jika bukan admin, tanggapan seragam (jangan bocorkan).
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.role !== "admin") {
    catatLoginGagal(email, ip);
    await catatLogin({
      email,
      userId: user?.id,
      status: "failed",
      reason: "akun tidak ditemukan atau bukan admin",
    });
    return {
      ...AWAL,
      emailTerakhir: email,
      error: "Email atau password salah.",
    };
  }

  // 3) Verifikasi password (bcrypt — hash, bukan plaintext)
  const cocok = await verifyPassword(password, user.password);
  if (!cocok) {
    const { terkunciMenit } = catatLoginGagal(email, ip);
    await catatLogin({
      email,
      userId: user.id,
      status: "failed",
      reason: "password salah",
    });
    return {
      ...AWAL,
      emailTerakhir: email,
      error: terkunciMenit
        ? `Terlalu banyak percobaan gagal. Akun dikunci selama ${terkunciMenit} menit.`
        : "Email atau password salah.",
    };
  }

  // 4) 2FA (TOTP). Jika kode belum dimasukkan → minta kode dulu.
  if (user.twoFactorEnabled) {
    if (!user.twoFactorSecret || !kode2FA) {
      return { error: null, perlu2FA: true, emailTerakhir: email };
    }
    if (!verifikasiTOTP(user.twoFactorSecret, kode2FA)) {
      catatLoginGagal(email, ip);
      await catatLogin({
        email,
        userId: user.id,
        status: "failed",
        reason: "kode 2FA salah",
      });
      return {
        error: "Kode 2FA tidak valid.",
        perlu2FA: true,
        emailTerakhir: email,
      };
    }
  }

  // 5) Sukses — reset penghitung & catat log
  catatLoginBerhasil(email, ip);
  await catatLogin({ email, userId: user.id, status: "success" });

  const token = await buatAdminSessionToken({ userId: user.id, email: user.email });
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 60 menit; di-refresh otomatis di middleware saat aktif
  });

  redirect("/panel-kelola");
}

export async function adminLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  redirect("/panel-kelola/login");
}