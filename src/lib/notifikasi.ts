// ============================================================
// Notifikasi sederhana.
// Untuk admin: link wa.me (bisa diklik admin) dengan ringkasan
// pesanan yang perlu diverifikasi. Integrasi WA API penuh (Fonnte,
// WA Business API) bisa ditambahkan belakangan tanpa mengubah alur.
// ============================================================

export const NOMOR_WA_ADMIN =
  process.env.WA_ADMIN || "6281211073408";

/**
 * Ubah berbagai format nomor WA jadi format internasional (62xxx).
 * Contoh: 081211073408 -> 6281211073408, 821... -> 62821...
 */
export function normalkanNomorWA(nomor: string): string {
  const bersih = nomor.replace(/[^\d]/g, "");
  if (bersih.startsWith("62")) return bersih;
  if (bersih.startsWith("0")) return `62${bersih.slice(1)}`;
  if (bersih.startsWith("8")) return `62${bersih}`;
  return bersih;
}

/**
 * Buat URL wa.me yang isi pesannya sudah terisi otomatis.
 */
export function buatLinkWA(nomor: string, pesan: string): string {
  const nomorIntl = normalkanNomorWA(nomor);
  return `https://wa.me/${nomorIntl}?text=${encodeURIComponent(pesan)}`;
}

type OrderRingkas = {
  orderId: string;
  nama: string;
  paketNama: string;
  amount: number;
  status: string;
  buktiUrl?: string | null;
};

/**
 * Pesan WA untuk admin — ringkasan pesanan yang menunggu verifikasi.
 * Bukti transfer dibuka lewat link halaman admin.
 */
export function pesanPembayaranMenunggu(
  order: OrderRingkas,
  adminUrl: string
): string {
  return [
    `🧾 *Pesanan Menunggu Verifikasi*`,
    `━━━━━━━━━━━━━━`,
    `Order : ${order.orderId}`,
    `Nama  : ${order.nama}`,
    `Paket : ${order.paketNama}`,
    `Total : Rp${order.amount.toLocaleString("id-ID")}`,
    `Status: ${order.status}`,
    ``,
    `Klik untuk cek & verifikasi: ${adminUrl}`,
  ].join("\n");
}

/**
 * Pesan WA notifikasi status pesanan ke klien (jika nomor tersedia).
 */
export function pesanStatusKeKlien(
  order: OrderRingkas,
  berhasil: boolean
): string {
  if (berhasil) {
    return [
      `✅ *Pembayaran Anda Disetujui!*`,
      `━━━━━━━━━━━━━━`,
      `Order : ${order.orderId}`,
      `Paket : ${order.paketNama}`,
      `Total : Rp${order.amount.toLocaleString("id-ID")}`,
      ``,
      `Undangan Anda sekarang AKTIF. Terima kasih!`,
    ].join("\n");
  }
  return [
    `❌ *Pembayaran Ditolak*`,
    `━━━━━━━━━━━━━━`,
    `Order : ${order.orderId}`,
    `Paket : ${order.paketNama}`,
    `Total : Rp${order.amount.toLocaleString("id-ID")}`,
    ``,
    `Mohon unggah ulang bukti transfer yang benar/valid.`,
  ].join("\n");
}
