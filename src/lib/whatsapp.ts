// ============================================================
// WhatsApp via Fonnte (https://fonnte.com) — opsional.
// Set FONNTE_TOKEN di .env untuk mengaktifkan pengiriman WA asli.
// Tanpa token, fungsi ini tidak melakukan apa-apa (return false);
// alur fallback (email + link wa.me buat admin) tetap berjalan.
// ============================================================

import { normalkanNomorWA } from "@/lib/notifikasi";

const FONNTE_URL = "https://api.fonnte.com/send";

/**
 * Kirim pesan WhatsApp. Best-effort: kegagalan tidak dilontarkan ke caller.
 * @returns true jika terkirim, false jika token kosong / gagal.
 */
export async function kirimWA(nomor: string, pesan: string): Promise<boolean> {
  const token = process.env.FONNTE_TOKEN;
  if (!token) {
    console.log("[WA] FONNTE_TOKEN belum diisi — lewati push WhatsApp");
    return false;
  }

  const target = normalkanNomorWA(nomor);
  if (!/^\d+$/.test(target)) {
    console.error("[WA] Nomor tidak valid:", nomor);
    return false;
  }

  try {
    const form = new URLSearchParams({
      target,
      message: pesan,
      countryCode: "62",
    });

    const res = await fetch(FONNTE_URL, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
    });

    const data = (await res.json()) as {
      status?: boolean;
      reason?: string;
      id?: string;
    };

    if (data.status === true) {
      console.log("[WA] Terkirim ke", target, "id:", data.id ?? "?");
      return true;
    }

    console.error("[WA] Gagal:", data.reason || JSON.stringify(data));
    return false;
  } catch (e) {
    console.error("[WA] Error koneksi:", e);
    return false;
  }
}