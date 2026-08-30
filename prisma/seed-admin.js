/* eslint-disable */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

// ============================================================
// AKUN ADMIN ANYAMAN CERITA
// Isi lewat .env (sebaiknya), atau langsung ubah di bawah ini:
//   node prisma/seed-admin.js
// ============================================================
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@anyamancerita.com";
const ADMIN_NAME = process.env.ADMIN_NAME || "Administrator";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@12345";

// Kebijakan password kuat (sama seperti aturan di aplikasi):
// 10+ karakter, huruf besar, huruf kecil, angka, simbol.
function cekKekuatanPassword(pw) {
  if (pw.length < 10) return "Password minimal 10 karakter.";
  if (!/[a-z]/.test(pw)) return "Password harus mengandung huruf kecil.";
  if (!/[A-Z]/.test(pw)) return "Password harus mengandung huruf besar.";
  if (!/[0-9]/.test(pw)) return "Password harus mengandung angka.";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Password harus mengandung simbol.";
  return null;
}

async function main() {
  try {
    console.log("🌱 Creating admin account...");

    const masalah = cekKekuatanPassword(ADMIN_PASSWORD);
    if (masalah) {
      console.error("❌ Password admin tidak kuat:", masalah);
      console.error("   Isi ADMIN_PASSWORD di .env dengan password yang kuat.");
      process.exit(1);
    }

    const password = await bcrypt.hash(ADMIN_PASSWORD, 12);

    const admin = await prisma.user.upsert({
      where: { email: ADMIN_EMAIL },
      update: {
        name: ADMIN_NAME,
        password,
        role: "admin",
      },
      create: {
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        password,
        role: "admin",
      },
    });

    console.log("✓ Admin account ready:");
    console.log("  Email:   ", admin.email);
    console.log("  Password:", ADMIN_PASSWORD);
    console.log("  Role:    ", admin.role);
  } catch (e) {
    console.error("Error:", e.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();