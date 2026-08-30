-- CreateEnum
CREATE TYPE "StatusPembayaran" AS ENUM ('pending', 'menunggu_verifikasi', 'aktif', 'ditolak', 'success', 'failed', 'expired');

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Transaction" ALTER COLUMN "status" TYPE "StatusPembayaran" USING ("status"::text::"StatusPembayaran");
ALTER TABLE "Transaction" ALTER COLUMN "status" SET DEFAULT 'pending';