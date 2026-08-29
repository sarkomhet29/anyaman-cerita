/* eslint-disable */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

// ============================================================
// AKUN ADMIN ANYAMAN CERITA
// Ubah nilai di bawah ini sesuai kebutuhan, lalu jalankan:
//   node prisma/seed-admin.js
// ============================================================
const ADMIN_EMAIL = "admin@anyamancerita.com";
const ADMIN_NAME = "Administrator";
const ADMIN_PASSWORD = "Admin@12345";

async function main() {
  try {
    console.log("🌱 Creating admin account...");

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