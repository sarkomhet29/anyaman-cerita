"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FEATURES, FEATURE_LABELS } from "@/lib/features";

type PaketTier = {
  id?: string;
  nama: string;
};

type Tier = {
  id: string;
  name: string;
  price: string;
  note: string;
  features: string[];
  highlight: boolean;
};

const tierDefaults = [
  {
    name: "Uji Coba",
    price: "Rp0",
    note: "Coba semua tema, watermark masih tampil",
    features: [
      FEATURES.GANTI_TEMA,
      FEATURES.UBAH_NAMA_TAMU,
      FEATURES.RSVP_UCAPAN,
    ],
    highlight: false,
  },
  {
    name: "Dasar",
    price: "Rp39.000",
    note: "Tanpa musik dan galeri foto",
    features: [
      FEATURES.GANTI_TEMA,
      FEATURES.UBAH_NAMA_TAMU,
      FEATURES.UNLIMITED_TAMU,
      FEATURES.RSVP_UCAPAN,
      FEATURES.TERINTEGRASI_GOOGLE_MAPS,
      FEATURES.SEBAR_UNLIMITED,
      FEATURES.UNLIMITED_REVISI,
    ],
    highlight: false,
  },
  {
    name: "Lengkap",
    price: "Rp69.000",
    note: "Pilihan favorit",
    features: [
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
    highlight: true,
  },
  {
    name: "Premium",
    price: "Rp119.000",
    note: "Semua fitur, tanpa batas",
    features: Object.values(FEATURES),
    highlight: false,
  },
];

export function PricingCards() {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tier IDs dari database
  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const response = await fetch("/api/paket");
        const data = (await response.json()) as PaketTier[];

        // Merge dengan defaults
        const mergedTiers = tierDefaults.map((tier) => {
          const dbTier = data.find((p) => p.nama === tier.name);
          return {
            ...tier,
            id: dbTier?.id || "",
          };
        });

        setTiers(mergedTiers);
      } catch (error) {
        console.error("Failed to fetch tiers:", error);
        setTiers(tierDefaults.map((t) => ({ ...t, id: "" })));
      } finally {
        setLoading(false);
      }
    };

    fetchTiers();
  }, []);

  const handleSelectTier = async (tierName: string, tierId: string) => {
    setSelectedTier(tierName);

    // Ke checkout page
    router.push(`/checkout?paketId=${tierId}`);
  };

  if (loading) {
    return (
      <div className="mt-14 grid gap-5 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-64 bg-surface-2 rounded-2xl" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-14 grid gap-5 lg:grid-cols-4">
      {tiers.map((tier) => (
        <div
          key={tier.name}
          className={`flex flex-col rounded-2xl p-7 ${
            tier.highlight
              ? "border-2 border-ink bg-surface"
              : "border border-line bg-surface"
          }`}
        >
          {tier.highlight && (
            <span className="mb-3 w-fit rounded-full bg-ink px-3 py-1 text-[11px] font-medium text-white">
              Paling Dipilih
            </span>
          )}
          <span className="text-sm font-medium text-ink-soft">{tier.name}</span>
          <span className="mt-2 text-3xl font-bold text-ink">{tier.price}</span>
          <p className="mt-2 text-sm text-ink-soft">{tier.note}</p>
          <ul className="mt-6 space-y-2 text-sm text-ink max-h-64 overflow-y-auto">
            {tier.features.map((featureKey) => (
              <li key={featureKey} className="flex items-start gap-2">
                <span className="text-accent flex-shrink-0 mt-0.5">✓</span>
                <span className="text-xs leading-relaxed">
                  {FEATURE_LABELS[featureKey as keyof typeof FEATURE_LABELS] ||
                    featureKey}
                </span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleSelectTier(tier.name, tier.id)}
            disabled={selectedTier === tier.name}
            className={`mt-8 rounded-full px-5 py-3 text-center text-sm font-medium transition-colors disabled:opacity-60 ${
              tier.highlight
                ? "bg-ink text-white hover:bg-black disabled:bg-ink"
                : "border border-line text-ink hover:border-ink disabled:border-ink disabled:bg-surface-2"
            }`}
          >
            {selectedTier === tier.name ? "Memproses..." : `Pilih ${tier.name}`}
          </button>
        </div>
      ))}
    </div>
  );
}
