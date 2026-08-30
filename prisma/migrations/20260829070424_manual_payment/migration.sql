-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "buktiUrl" TEXT,
ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'manual',
ADD COLUMN     "undanganId" TEXT,
ADD COLUMN     "verifiedAt" TIMESTAMP(3),
ADD COLUMN     "verifiedById" TEXT;

-- AlterTable
ALTER TABLE "Undangan" ADD COLUMN     "aktifSampai" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_undanganId_fkey" FOREIGN KEY ("undanganId") REFERENCES "Undangan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
