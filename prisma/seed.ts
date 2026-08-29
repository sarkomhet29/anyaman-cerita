import { prisma } from "@/lib/prisma";
import { FEATURES } from "@/lib/features";

const paketData = [
  {
    nama: "Uji Coba",
    harga: 0,
    deskripsi: "Coba semua tema, watermark masih tampil",
    urutan: 1,
    highlight: false,
    fitur: [
      FEATURES.GANTI_TEMA,
      FEATURES.UBAH_NAMA_TAMU,
      FEATURES.RSVP_UCAPAN,
    ],
  },
  {
    nama: "Dasar",
    harga: 39000,
    deskripsi: "Tanpa musik dan galeri foto",
    urutan: 2,
    highlight: false,
    fitur: [
      FEATURES.GANTI_TEMA,
      FEATURES.UBAH_NAMA_TAMU,
      FEATURES.UNLIMITED_TAMU,
      FEATURES.RSVP_UCAPAN,
      FEATURES.TERINTEGRASI_GOOGLE_MAPS,
      FEATURES.SEBAR_UNLIMITED,
      FEATURES.UNLIMITED_REVISI,
    ],
  },
  {
    nama: "Lengkap",
    harga: 69000,
    deskripsi: "Pilihan favorit",
    urutan: 3,
    highlight: true,
    fitur: [
      FEATURES.GANTI_TEMA,
      FEATURES.UBAH_FONT_WARNA,
      FEATURES.UBAH_NAMA_TAMU,
      FEATURES.UNLIMITED_TAMU,
      FEATURES.RSVP_UCAPAN,
      FEATURES.BALAS_UCAPAN_TAMU,
      FEATURES.QRCODE_BUKU_TAMU,
      FEATURES.TANPA_MASA_AKTIF,
      FEATURES.SEBAR_UNLIMITED,
      FEATURES.TERINTEGRASI_GOOGLE_MAPS,
      FEATURES.FOTO_GALERY_VIDEO,
      FEATURES.RATUSAN_MUSIK_CUSTOM,
      FEATURES.COUNTDOWN_HARI_H,
      FEATURES.AUTO_SCROLL,
      FEATURES.PENGINGAT_GOOGLE_CALENDAR,
      FEATURES.LAPORAN_STATISTIK_SEBAR,
      FEATURES.UNLIMITED_REVISI,
    ],
  },
  {
    nama: "Premium",
    harga: 119000,
    deskripsi: "Semua fitur, tanpa batas",
    urutan: 4,
    highlight: false,
    fitur: Object.values(FEATURES),
  },
];

async function seedPaket() {
  try {
    // Hapus data lama
    await prisma.paketFitur.deleteMany();
    await prisma.paket.deleteMany();

    // Insert paket baru
    for (const data of paketData) {
      const paket = await prisma.paket.create({
        data: {
          nama: data.nama,
          harga: data.harga,
          deskripsi: data.deskripsi,
          urutan: data.urutan,
          highlight: data.highlight,
        },
      });

      // Insert fitur untuk paket ini
      for (const fiturKey of data.fitur) {
        await prisma.paketFitur.create({
          data: {
            paketId: paket.id,
            fiturKey,
          },
        });
      }

      console.log(`✓ Paket "${data.nama}" created with ${data.fitur.length} fitur`);
    }

    console.log("\n✓ Seeding paket berhasil!");
  } catch (error) {
    console.error("Error seeding paket:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedPaket();
