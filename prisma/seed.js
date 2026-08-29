/* eslint-disable */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const FEATURES = {
  GANTI_TEMA: "ganti_tema",
  UBAH_FONT_WARNA: "ubah_font_warna",
  KOSTUMISASI_TEMA: "kostumisasi_tema",
  UBAH_SUSUNAN_KOMPONEN: "ubah_susunan_komponen",
  REQUEST_TEMA_BARU: "request_tema_baru",
  UBAH_NAMA_TAMU: "ubah_nama_tamu",
  UNLIMITED_TAMU: "unlimited_tamu",
  RSVP_UCAPAN: "rsvp_ucapan",
  BALAS_UCAPAN_TAMU: "balas_ucapan_tamu",
  TURUT_MENGUNDANG: "turut_mengundang",
  QRCODE_BUKU_TAMU: "qrcode_buku_tamu",
  TANPA_MASA_AKTIF: "tanpa_masa_aktif",
  SEBAR_UNLIMITED: "sebar_unlimited",
  TERINTEGRASI_GOOGLE_MAPS: "terintegrasi_google_maps",
  EMBED_MAP_LOKASI: "embed_map_lokasi",
  FOTO_GALERY_VIDEO: "foto_galery_video",
  RATUSAN_MUSIK_CUSTOM: "ratusan_musik_custom",
  LOVE_STORY_SUSUNAN: "love_story_susunan",
  VIDEO_UCAPAN: "video_ucapan",
  COUNTDOWN_HARI_H: "countdown_hari_h",
  AUTO_SCROLL: "auto_scroll",
  LAYAR_SAPA_CHECKIN: "layar_sapa_checkin",
  PENGINGAT_GOOGLE_CALENDAR: "pengingat_google_calendar",
  LINK_LIVE_STREAMING: "link_live_streaming",
  REKENING_TITIP_HADIAH: "rekening_titip_hadiah",
  TITIP_KADO_FISIK: "titip_kado_fisik",
  GIFT_VIRTUAL: "gift_virtual",
  LAPORAN_STATISTIK_SEBAR: "laporan_statistik_sebar",
  UNLIMITED_REVISI: "unlimited_revisi",
  TERIMA_BERES_ADMIN: "terima_beres_admin",
};

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

async function main() {
  try {
    console.log("🌱 Seeding paket...");
    
    for (const data of paketData) {
      const paket = await prisma.paket.upsert({
        where: { nama: data.nama },
        update: {
          harga: data.harga,
          deskripsi: data.deskripsi,
          urutan: data.urutan,
          highlight: data.highlight,
        },
        create: {
          nama: data.nama,
          harga: data.harga,
          deskripsi: data.deskripsi,
          urutan: data.urutan,
          highlight: data.highlight,
        },
      });

      // Delete existing fitur
      await prisma.paketFitur.deleteMany({
        where: { paketId: paket.id },
      });

      // Insert fitur baru
      for (const fiturKey of data.fitur) {
        await prisma.paketFitur.create({
          data: {
            paketId: paket.id,
            fiturKey,
          },
        });
      }

      console.log(`✓ Paket "${data.nama}" with ${data.fitur.length} fitur`);
    }

    console.log("\n✓ Seeding complete!");
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
