"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { generateTOTPSecret, verifikasiTOTP } from "@/lib/totp";
import { periksaKekuatanPassword } from "@/lib/password";

type Hasil = { error?: string; ok?: boolean };

export type GantiPasswordState = Hasil;
export type Aktifkan2FAState = Hasil;
export type Konfirmasi2FAState = Hasil;

/** Langkah 1: buat secret TOTP baru (belum aktif sampai kode pertama dikonfirmasi). */
export async function mulai2FAAction(): Promise<Hasil> {
  const admin = await requireAdmin();
  const user = await prisma.user.findUnique({ where: { id: admin.id } });
  if (!user) return { error: "Admin tidak ditemukan." };
  if (user.twoFactorEnabled) return { error: "2FA sudah aktif." };

  const secret = user.twoFactorSecret || generateTOTPSecret();
  await prisma.user.update({
    where: { id: admin.id },
    data: { twoFactorSecret: secret },
  });
  revalidatePath("/panel-kelola/keamanan");
  return { ok: true };
}

/** Langkah 2: verifikasi kode pertama, baru nyalakan 2FA. */
export async function konfirmasi2FAAction(formData: FormData): Promise<Hasil> {
  const admin = await requireAdmin();
  const kode = String(formData.get("kode") || "").trim();

  const user = await prisma.user.findUnique({ where: { id: admin.id } });
  if (!user || !user.twoFactorSecret) {
    return { error: "Secret 2FA tidak ditemukan. Mulai ulang setup." };
  }

  if (!verifikasiTOTP(user.twoFactorSecret, kode)) {
    return { error: "Kode 2FA tidak valid." };
  }

  await prisma.user.update({
    where: { id: admin.id },
    data: { twoFactorEnabled: true },
  });
  revalidatePath("/panel-kelola/keamanan");
  return { ok: true };
}

export async function nonaktifkan2FAAction(): Promise<Hasil> {
  const admin = await requireAdmin();
  await prisma.user.update({
    where: { id: admin.id },
    data: { twoFactorEnabled: false, twoFactorSecret: null },
  });
  revalidatePath("/panel-kelola/keamanan");
  return { ok: true };
}

export async function gantiPasswordAdminAction(
  _prev: GantiPasswordState,
  formData: FormData
): Promise<GantiPasswordState> {
  const admin = await requireAdmin();
  const lama = String(formData.get("passwordLama") || "");
  const baru = String(formData.get("passwordBaru") || "");

  const user = await prisma.user.findUnique({
    where: { id: admin.id },
    select: { id: true, password: true },
  });
  if (!user) return { error: "Admin tidak ditemukan." };

  const cocok = await verifyPassword(lama, user.password);
  if (!cocok) return { error: "Password lama salah." };

  const cek = periksaKekuatanPassword(baru);
  if (!cek.ok) return { error: cek.alasan };

  const hashed = await hashPassword(baru);
  await prisma.user.update({ where: { id: admin.id }, data: { password: hashed } });
  revalidatePath("/panel-kelola/keamanan");
  return { ok: true };
}