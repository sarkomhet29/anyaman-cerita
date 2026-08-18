import { PrismaClient } from "@prisma/client";

// Mencegah membuat koneksi Prisma berulang kali saat development (hot reload)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
