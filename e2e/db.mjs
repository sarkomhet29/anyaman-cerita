/* eslint-disable */
// CLI helper DB untuk test e2e:
//   node e2e/db.mjs seed
//   node e2e/db.mjs setrole <email> <role>
//   node e2e/db.mjs hash <email>
//   node e2e/db.mjs loginlog <email> <status>
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_NO_2FA = { email: "admin@test.local", password: "Admin@12345" };
const ADMIN_CLIENT_ROLE = { email: "rolerecheck@test.local", password: "User@12345" };
const ADMIN_LOCK_TEST = { email: "lock@test.local", password: "Admin@12345" };
// 2FA pakai secret TOTP tetap klasik (RFC 4226 test vector "Hello!").
const ADMIN_2FA = { email: "admin2fa@test.local", password: "Admin@12345" };
const SECRET_2FA = "JBSWY3DPEHPK3PXP";
// Admin khusus alur pembayaran (tidak tersentuh test keamanan, jadi tidak
// kena lockout rate-limit yang dibuat oleh admin-security.spec.ts).
const ADMIN_FLOW = { email: "adminflow@test.local", password: "Admin@12345" };

async function hash(pw) {
  return bcrypt.hash(pw, 12);
}

async function seed() {
  // Reset semua baris sensitif — DB khusus test.
  await prisma.loginLog.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.undangan.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.paket.deleteMany();
  await prisma.user.deleteMany();

  const pw = await hash(ADMIN_NO_2FA.password);
  const pw2 = await hash(ADMIN_CLIENT_ROLE.password);
  const pw3 = await hash(ADMIN_LOCK_TEST.password);
  const pw4 = await hash(ADMIN_2FA.password);
  const pw5 = await hash(ADMIN_FLOW.password);

  await prisma.user.createMany({
    data: [
      { email: ADMIN_NO_2FA.email, name: "Admin Biasa", password: pw, role: "admin" },
      {
        email: ADMIN_CLIENT_ROLE.email,
        name: "Sok Admin",
        password: pw2,
        role: "admin",
      },
      { email: ADMIN_LOCK_TEST.email, name: "Lock Test", password: pw3, role: "admin" },
      {
        email: ADMIN_2FA.email,
        name: "Admin 2FA",
        password: pw4,
        role: "admin",
        twoFactorSecret: SECRET_2FA,
        twoFactorEnabled: true,
      },
      { email: ADMIN_FLOW.email, name: "Admin Alur", password: pw5, role: "admin" },
    ],
  });

  await prisma.paket.create({
    data: { nama: "Uji Coba", harga: 0, urutan: 1 },
  });
  await prisma.paket.create({
    data: { nama: "Dasar", harga: 100000, urutan: 2 },
  });

  console.log("seed OK:", JSON.stringify({ emails: [ADMIN_NO_2FA.email, ADMIN_CLIENT_ROLE.email, ADMIN_LOCK_TEST.email, ADMIN_2FA.email] }));
}

async function setRole(email, role) {
  await prisma.user.update({ where: { email }, data: { role } });
  console.log("setrole OK:", email, role);
}

async function hashOf(email) {
  const u = await prisma.user.findUnique({ where: { email }, select: { password: true } });
  console.log(u ? u.password : "NOT_FOUND");
}

async function loginlog(email, status) {
  const n = await prisma.loginLog.count({ where: { email, status } });
  const rows = await prisma.loginLog.findMany({
    where: { email, status },
    orderBy: { createdAt: "desc" },
    select: { email: true, status: true, ip: true, reason: true, createdAt: true },
  });
  console.log(JSON.stringify({ count: n, rows }));
}

const [action, arg1, arg2] = process.argv.slice(2);
(async () => {
  try {
    if (action === "seed") await seed();
    else if (action === "setrole") await setRole(arg1, arg2);
    else if (action === "hash") await hashOf(arg1);
    else if (action === "loginlog") await loginlog(arg1, arg2);
    else throw new Error("action tidak dikenal");
  } catch (e) {
    console.error("db.mjs error:", e.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();