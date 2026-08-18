"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { buatSessionToken, COOKIE_NAME } from "@/lib/session";
import { loginSchema } from "@/lib/validation";

export type LoginState = {
  error: string | null;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
  });

  if (!parsed.success) {
    return { error: "Email atau password tidak valid." };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  // Pesan error sengaja dibuat sama (tidak bocorkan apakah email terdaftar)
  if (!user || !(await verifyPassword(parsed.data.password, user.password))) {
    return { error: "Email atau password salah." };
  }

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

export async function logoutAction() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/login");
}
