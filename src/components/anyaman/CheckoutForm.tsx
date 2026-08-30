"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Paket = {
  id: string;
  nama: string;
  harga: number;
};

export function CheckoutForm({ paket }: { paket: Paket }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metode, setMetode] = useState<"manual" | "midtrans">("manual");

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call checkout API
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paketId: paket.id, method: metode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      // Jika gratis (Uji Coba), langsung redirect ke dashboard
      if (data.redirectUrl === "/dashboard") {
        router.push("/dashboard");
        return;
      }

      // Jika berbayar, redirect ke Midtrans (URL eksternal)
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-8">
      <h3 className="text-lg font-bold text-ink mb-6">Ringkasan Pesanan</h3>

      {/* Order Summary */}
      <div className="space-y-3 pb-6 border-b border-line mb-6">
        <div className="flex justify-between">
          <span className="text-ink-soft">Paket {paket.nama}</span>
          <span className="font-medium text-ink">
            {paket.harga === 0
              ? "Gratis"
              : `Rp${paket.harga.toLocaleString("id-ID")}`}
          </span>
        </div>
        <div className="flex justify-between pt-3 border-t border-line">
          <span className="font-semibold text-ink">Total</span>
          <span className="text-lg font-bold text-accent">
            {paket.harga === 0
              ? "Gratis"
              : `Rp${paket.harga.toLocaleString("id-ID")}`}
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Metode pembayaran */}
      {paket.harga > 0 && (
        <div className="mb-6 space-y-2">
          <p className="text-xs font-semibold text-ink-soft uppercase">
            Metode Pembayaran
          </p>
          <label
            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
              metode === "manual"
                ? "border-ink bg-surface-2"
                : "border-line hover:border-ink"
            }`}
          >
            <input
              type="radio"
              name="metode"
              value="manual"
              checked={metode === "manual"}
              onChange={() => setMetode("manual")}
              className="accent-ink"
            />
            <span>
              <span className="block text-sm font-medium text-ink">
                Transfer Manual
              </span>
              <span className="block text-xs text-ink-soft">
                Transfer ke rekening, lalu unggah bukti. Diverifikasi admin.
              </span>
            </span>
          </label>
          <label
            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
              metode === "midtrans"
                ? "border-ink bg-surface-2"
                : "border-line hover:border-ink"
            }`}
          >
            <input
              type="radio"
              name="metode"
              value="midtrans"
              checked={metode === "midtrans"}
              onChange={() => setMetode("midtrans")}
              className="accent-ink"
            />
            <span>
              <span className="block text-sm font-medium text-ink">
                Midtrans (Otomatis)
              </span>
              <span className="block text-xs text-ink-soft">
                Kartu kredit, e-wallet, transfer bank — langsung aktif.
              </span>
            </span>
          </label>
        </div>
      )}

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full rounded-full bg-ink px-6 py-3.5 text-base font-medium text-white hover:bg-black disabled:opacity-60 mb-3 transition-colors"
      >
        {loading
          ? "Memproses..."
          : paket.harga === 0
          ? "Aktifkan Gratis"
          : metode === "manual"
          ? "Lanjutkan Bayar Manual"
          : "Lanjutkan ke Pembayaran"}
      </button>

      <Link
        href="/harga"
        className="block w-full text-center rounded-full border border-line px-6 py-3.5 text-base font-medium text-ink hover:border-ink transition-colors"
      >
        Kembali
      </Link>

      {/* Payment Methods Info */}
      {paket.harga > 0 && (
        <div className="mt-8 pt-8 border-t border-line">
          <p className="text-xs text-ink-soft uppercase mb-4">Metode Pembayaran</p>
          <div className="space-y-2">
            <p className="text-sm text-ink">✓ Transfer Bank</p>
            <p className="text-sm text-ink">✓ Kartu Kredit</p>
            <p className="text-sm text-ink">✓ E-Wallet (GCash, Dana, OVO)</p>
            <p className="text-sm text-ink">✓ Cicilan Tanpa Bunga</p>
          </div>
        </div>
      )}

      {/* Terms */}
      <p className="text-xs text-ink-soft mt-8 text-center">
        Dengan melanjutkan, Anda setuju dengan{" "}
        <Link href="#" className="text-accent hover:underline">
          Syarat & Ketentuan
        </Link>
        {" "}kami
      </p>
    </div>
  );
}
