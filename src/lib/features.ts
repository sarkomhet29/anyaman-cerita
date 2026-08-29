// Daftar lengkap fitur yang tersedia
export const FEATURES = {
  // Tema & Customization
  GANTI_TEMA: "ganti_tema",
  UBAH_FONT_WARNA: "ubah_font_warna",
  KOSTUMISASI_TEMA: "kostumisasi_tema",
  UBAH_SUSUNAN_KOMPONEN: "ubah_susunan_komponen",
  REQUEST_TEMA_BARU: "request_tema_baru",

  // Tamu & RSVP
  UBAH_NAMA_TAMU: "ubah_nama_tamu",
  UNLIMITED_TAMU: "unlimited_tamu",
  RSVP_UCAPAN: "rsvp_ucapan",
  BALAS_UCAPAN_TAMU: "balas_ucapan_tamu",
  TURUT_MENGUNDANG: "turut_mengundang",
  QRCODE_BUKU_TAMU: "qrcode_buku_tamu",

  // Aktivasi & Masa Berlaku
  TANPA_MASA_AKTIF: "tanpa_masa_aktif",
  SEBAR_UNLIMITED: "sebar_unlimited",

  // Lokasi & Maps
  TERINTEGRASI_GOOGLE_MAPS: "terintegrasi_google_maps",
  EMBED_MAP_LOKASI: "embed_map_lokasi",

  // Konten Multimedia
  FOTO_GALERY_VIDEO: "foto_galery_video",
  RATUSAN_MUSIK_CUSTOM: "ratusan_musik_custom",
  LOVE_STORY_SUSUNAN: "love_story_susunan",
  VIDEO_UCAPAN: "video_ucapan",

  // Fitur Interaktif
  COUNTDOWN_HARI_H: "countdown_hari_h",
  AUTO_SCROLL: "auto_scroll",
  LAYAR_SAPA_CHECKIN: "layar_sapa_checkin",

  // Integrasi Eksternal
  PENGINGAT_GOOGLE_CALENDAR: "pengingat_google_calendar",
  LINK_LIVE_STREAMING: "link_live_streaming",

  // Hadiah & Gifts
  REKENING_TITIP_HADIAH: "rekening_titip_hadiah",
  TITIP_KADO_FISIK: "titip_kado_fisik",
  GIFT_VIRTUAL: "gift_virtual",

  // Laporan & Support
  LAPORAN_STATISTIK_SEBAR: "laporan_statistik_sebar",
  UNLIMITED_REVISI: "unlimited_revisi",
  TERIMA_BERES_ADMIN: "terima_beres_admin",
} as const;

// Pengelompokan fitur berdasarkan kategori
export const FEATURE_CATEGORIES = {
  TEMA: [
    FEATURES.GANTI_TEMA,
    FEATURES.UBAH_FONT_WARNA,
    FEATURES.KOSTUMISASI_TEMA,
    FEATURES.UBAH_SUSUNAN_KOMPONEN,
    FEATURES.REQUEST_TEMA_BARU,
  ],
  TAMU: [
    FEATURES.UBAH_NAMA_TAMU,
    FEATURES.UNLIMITED_TAMU,
    FEATURES.RSVP_UCAPAN,
    FEATURES.BALAS_UCAPAN_TAMU,
    FEATURES.TURUT_MENGUNDANG,
    FEATURES.QRCODE_BUKU_TAMU,
  ],
  AKTIVASI: [
    FEATURES.TANPA_MASA_AKTIF,
    FEATURES.SEBAR_UNLIMITED,
  ],
  LOKASI: [
    FEATURES.TERINTEGRASI_GOOGLE_MAPS,
    FEATURES.EMBED_MAP_LOKASI,
  ],
  KONTEN: [
    FEATURES.FOTO_GALERY_VIDEO,
    FEATURES.RATUSAN_MUSIK_CUSTOM,
    FEATURES.LOVE_STORY_SUSUNAN,
    FEATURES.VIDEO_UCAPAN,
  ],
  INTERAKTIF: [
    FEATURES.COUNTDOWN_HARI_H,
    FEATURES.AUTO_SCROLL,
    FEATURES.LAYAR_SAPA_CHECKIN,
  ],
  INTEGRASI: [
    FEATURES.PENGINGAT_GOOGLE_CALENDAR,
    FEATURES.LINK_LIVE_STREAMING,
  ],
  HADIAH: [
    FEATURES.REKENING_TITIP_HADIAH,
    FEATURES.TITIP_KADO_FISIK,
    FEATURES.GIFT_VIRTUAL,
  ],
  LAPORAN: [
    FEATURES.LAPORAN_STATISTIK_SEBAR,
    FEATURES.UNLIMITED_REVISI,
    FEATURES.TERIMA_BERES_ADMIN,
  ],
} as const;

// Mapping fitur ke label yang user-friendly
export const FEATURE_LABELS: Record<string, string> = {
  [FEATURES.GANTI_TEMA]: "Bebas Ganti Ke Semua Tema",
  [FEATURES.UBAH_FONT_WARNA]: "Ubah Font dan Warna Tulisan",
  [FEATURES.KOSTUMISASI_TEMA]: "Kostumisasi Tema Undangan",
  [FEATURES.UBAH_SUSUNAN_KOMPONEN]: "Ubah Susunan Komponen",
  [FEATURES.REQUEST_TEMA_BARU]: "Request Tema Baru",
  [FEATURES.UBAH_NAMA_TAMU]: "Ubah Nama Tamu Unlimited",
  [FEATURES.UNLIMITED_TAMU]: "Unlimited Tamu",
  [FEATURES.RSVP_UCAPAN]: "RSVP & Ucapan",
  [FEATURES.BALAS_UCAPAN_TAMU]: "Balas Ucapan Tamu",
  [FEATURES.TURUT_MENGUNDANG]: "Fitur Turut Mengundang",
  [FEATURES.QRCODE_BUKU_TAMU]: "QRCode Buku Tamu",
  [FEATURES.TANPA_MASA_AKTIF]: "Tanpa Masa Aktif",
  [FEATURES.SEBAR_UNLIMITED]: "Sebar Ke Unlimited Penerima",
  [FEATURES.TERINTEGRASI_GOOGLE_MAPS]: "Terintegrasi Google Maps",
  [FEATURES.EMBED_MAP_LOKASI]: "Embed Map Lokasi Acara",
  [FEATURES.FOTO_GALERY_VIDEO]: "Foto Galery & Video",
  [FEATURES.RATUSAN_MUSIK_CUSTOM]: "Ratusan Music Bisa Custom",
  [FEATURES.LOVE_STORY_SUSUNAN]: "Love Story & Susunan Acara",
  [FEATURES.VIDEO_UCAPAN]: "Video Ucapan",
  [FEATURES.COUNTDOWN_HARI_H]: "Countdown Menuju Hari-H",
  [FEATURES.AUTO_SCROLL]: "Fitur Auto Scroll",
  [FEATURES.LAYAR_SAPA_CHECKIN]: "Layar Sapa & Check-in Tamu",
  [FEATURES.PENGINGAT_GOOGLE_CALENDAR]: "Pengingat Google Calendar",
  [FEATURES.LINK_LIVE_STREAMING]: "Link Live Streaming",
  [FEATURES.REKENING_TITIP_HADIAH]: "Rekening Titip Hadiah",
  [FEATURES.TITIP_KADO_FISIK]: "Titip Kado Fisik Ke Acara",
  [FEATURES.GIFT_VIRTUAL]: "Gift Virtual Di Undangan",
  [FEATURES.LAPORAN_STATISTIK_SEBAR]: "Laporan Statistik Sebar",
  [FEATURES.UNLIMITED_REVISI]: "Unlimited Revisi Sepuasnya",
  [FEATURES.TERIMA_BERES_ADMIN]: "Terima Beres Dibuatin Admin",
} as const;
