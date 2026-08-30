/* eslint-disable */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("🌱 Creating test user...");

    const TEST_EMAIL = process.env.SEED_USER_EMAIL || "test@example.com";
    const TEST_PASSWORD = process.env.SEED_USER_PASSWORD || "Password123";
    const TEST_NAME = process.env.SEED_USER_NAME || "Test User";
    const TEST_PHONE = process.env.SEED_USER_PHONE || "081234567890";

    // Get paket Uji Coba
    const paket = await prisma.paket.findUnique({
      where: { nama: "Uji Coba" },
    });

    if (!paket) {
      console.error("❌ Paket Uji Coba tidak ditemukan. Jalankan seed.js dulu.");
      process.exit(1);
    }

    // Hash password
    const password = await bcrypt.hash(TEST_PASSWORD, 12);

    // Create test user
    const user = await prisma.user.upsert({
      where: { email: TEST_EMAIL },
      update: {
        name: TEST_NAME,
        phone: TEST_PHONE,
        password,
        paketId: paket.id,
      },
      create: {
        email: TEST_EMAIL,
        name: TEST_NAME,
        phone: TEST_PHONE,
        password,
        paketId: paket.id,
      },
    });

    console.log("✓ Test user created:");
    console.log("  Email:", user.email);
    console.log("  ID:", user.id);
    console.log("  Paket:", paket.nama);
  } catch (e) {
    console.error("Error:", e.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
