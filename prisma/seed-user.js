/* eslint-disable */
const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("./src/lib/auth");
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("🌱 Creating test user...");
    
    // Get paket Uji Coba
    const paket = await prisma.paket.findUnique({
      where: { nama: "Uji Coba" },
    });

    if (!paket) {
      console.error("❌ Paket Uji Coba tidak ditemukan");
      process.exit(1);
    }

    // Hash password
    const password = await hashPassword("Password123");

    // Create test user
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        name: "Test User",
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
