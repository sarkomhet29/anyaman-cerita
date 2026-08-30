import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";
import { hashPassword } from "@/lib/auth";

// Contoh API route registrasi user — pola ini bisa dicontoh untuk endpoint lain:
// 1. Validasi input (zod)
// 2. Cek duplikasi
// 3. Hash data sensitif (password)
// 4. Simpan ke database lewat Prisma (aman dari SQL injection secara default)

export async function POST(request: Request) {
  try {
    // Aplikasi ini hanya untuk SATU admin (pemilik bisnis). Supaya endpoint
    // ini tidak jadi celah pendaftaran publik ke dashboard, registrasi
    // hanya diizinkan sekali — saat belum ada user sama sekali di database.
    const jumlahUser = await prisma.user.count();
    if (jumlahUser > 0) {
      return NextResponse.json(
        { error: "Registrasi ditutup. Sudah ada akun admin." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, name, password, phone } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        phone: (phone || "").trim() || null,
        password: hashedPassword,
      },
      select: { id: true, email: true, name: true, phone: true, createdAt: true }, // jangan pernah kembalikan field password
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
