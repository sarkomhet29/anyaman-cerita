"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { buatSessionToken, COOKIE_NAME } from "@/lib/session";
import { registerSchema } from "@/lib/validation";

export type RegisterState = {
  error: string | null;
};

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    email: String(formData.get("email") || ""),
    name: String(formData.get("name") || "") || undefined,
    password: String(formData.get("password") || ""),
  });

  if (!parsed.success) {
    const errorMessage = parsed.error.flatten().fieldErrors;
    const firstError = Object.values(errorMessage)[0]?.[0];
    return { error: firstError || "Data tidak valid." };
  }

  // Cek apakah email sudah terdaftar
  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existingUser) {
    return { error: "Email sudah terdaftar." };
  }

  // Hash password dan buat user baru dengan default paket Uji Coba
  const hashedPassword = await hashPassword(parsed.data.password);
  
  // Cari atau create paket Uji Coba
  const paketUjiCoba = await prisma.paket.findUnique({
    where: { nama: "Uji Coba" },
  });

  if (!paketUjiCoba) {
    return { error: "Paket default tidak ditemukan. Hubungi admin." };
  }

  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      password: hashedPassword,
      paketId: paketUjiCoba.id,
    },
  });

  // Buat session dan set cookie
  const token = await buatSessionToken({ userId: user.id, email: user.email });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });

  redirect("/dashboard");
}
