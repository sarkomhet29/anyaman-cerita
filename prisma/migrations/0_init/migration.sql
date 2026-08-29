-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "paketId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paket" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "harga" INTEGER NOT NULL,
    "deskripsi" TEXT,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "highlight" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaketFitur" (
    "id" TEXT NOT NULL,
    "paketId" TEXT NOT NULL,
    "fiturKey" TEXT NOT NULL,

    CONSTRAINT "PaketFitur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Undangan" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jenisAcara" TEXT NOT NULL,
    "namaUtama" TEXT NOT NULL,
    "tanggalAcara" TIMESTAMP(3) NOT NULL,
    "waktuAcara" TEXT,
    "lokasi" TEXT NOT NULL,
    "alamatLengkap" TEXT,
    "mapsUrl" TEXT,
    "tema" TEXT NOT NULL DEFAULT 'songket-senja',
    "pesanUndangan" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Undangan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tamu" (
    "id" TEXT NOT NULL,
    "undanganId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kehadiran" TEXT,
    "ucapan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tamu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subjek" TEXT NOT NULL,
    "pesan" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'baru',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paketId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "midtransId" TEXT,
    "orderId" TEXT NOT NULL,
    "paymentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Paket_nama_key" ON "Paket"("nama");

-- CreateIndex
CREATE INDEX "Paket_urutan_idx" ON "Paket"("urutan");

-- CreateIndex
CREATE INDEX "PaketFitur_paketId_idx" ON "PaketFitur"("paketId");

-- CreateIndex
CREATE UNIQUE INDEX "PaketFitur_paketId_fiturKey_key" ON "PaketFitur"("paketId", "fiturKey");

-- CreateIndex
CREATE UNIQUE INDEX "Undangan_slug_key" ON "Undangan"("slug");

-- CreateIndex
CREATE INDEX "Undangan_status_idx" ON "Undangan"("status");

-- CreateIndex
CREATE INDEX "Undangan_userId_idx" ON "Undangan"("userId");

-- CreateIndex
CREATE INDEX "Tamu_undanganId_idx" ON "Tamu"("undanganId");

-- CreateIndex
CREATE INDEX "ContactMessage_status_idx" ON "ContactMessage"("status");

-- CreateIndex
CREATE INDEX "ContactMessage_createdAt_idx" ON "ContactMessage"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_orderId_key" ON "Transaction"("orderId");

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");

-- CreateIndex
CREATE INDEX "Transaction_midtransId_idx" ON "Transaction"("midtransId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_paketId_fkey" FOREIGN KEY ("paketId") REFERENCES "Paket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaketFitur" ADD CONSTRAINT "PaketFitur_paketId_fkey" FOREIGN KEY ("paketId") REFERENCES "Paket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Undangan" ADD CONSTRAINT "Undangan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tamu" ADD CONSTRAINT "Tamu_undanganId_fkey" FOREIGN KEY ("undanganId") REFERENCES "Undangan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_paketId_fkey" FOREIGN KEY ("paketId") REFERENCES "Paket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

