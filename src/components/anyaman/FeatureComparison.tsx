"use client";

import { useUserFeatures } from "@/hooks/useFeatures";
import { FEATURES, FEATURE_LABELS, FEATURE_CATEGORIES } from "@/lib/features";

const tiers = [
  {
    name: "Uji Coba",
    price: "Rp0",
    features: [
      FEATURES.GANTI_TEMA,
      FEATURES.UBAH_NAMA_TAMU,
      FEATURES.RSVP_UCAPAN,
    ],
  },
  {
    name: "Dasar",
    price: "Rp39.000",
    features: [
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
    name: "Lengkap",
    price: "Rp69.000",
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
  },
  {
    name: "Premium",
    price: "Rp119.000",
    features: Object.values(FEATURES),
  },
];

export function FeatureComparison() {
  const { data: userFeatures, loading } = useUserFeatures();

  return (
    <section className="bg-surface py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Bandingkan Semua Fitur
          </h2>
          <p className="mt-4 text-ink-soft">
            Lihat detail lengkap fitur setiap paket
          </p>
        </div>

        {/* Sticky Header - Tier Names and Prices */}
        <div className="mb-8 grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-1" />
          {tiers.map((tier) => (
            <div key={tier.name} className="rounded-2xl border border-line bg-surface-2 p-4 text-center">
              <p className="font-semibold text-ink">{tier.name}</p>
              <p className="text-lg font-bold text-accent mt-2">{tier.price}</p>
            </div>
          ))}
        </div>

        {/* Feature Categories */}
        <div className="space-y-8">
          {Object.entries(FEATURE_CATEGORIES).map(([categoryName, categoryFeatures]) => (
            <div key={categoryName}>
              {/* Category Header */}
              <div className="mb-4 pb-2 border-b-2 border-line">
                <h3 className="text-lg font-bold text-ink">{categoryName}</h3>
              </div>

              {/* Features in Category */}
              <div className="space-y-3">
                {categoryFeatures.map((featureKey) => {
                  const label = FEATURE_LABELS[featureKey as keyof typeof FEATURE_LABELS];
                  return (
                    <div
                      key={featureKey}
                      className="grid gap-4 lg:grid-cols-5 items-center p-3 rounded-lg hover:bg-surface-2 transition-colors"
                    >
                      {/* Feature Name */}
                      <div className="lg:col-span-1">
                        <p className="text-sm font-medium text-ink">{label}</p>
                      </div>

                      {/* Feature Availability per Tier */}
                      {tiers.map((tier) => {
                        const hasFeature = tier.features.includes(featureKey);
                        return (
                          <div
                            key={`${tier.name}-${featureKey}`}
                            className="flex justify-center"
                          >
                            {hasFeature ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent/10">
                                <span className="text-accent font-bold text-sm">✓</span>
                              </span>
                            ) : (
                              <span className="text-ink-soft text-lg">—</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-ink-soft mb-6">
            {loading ? "Loading..." : userFeatures ? "Siap membuat undangan?" : "Pilih paket yang sesuai dengan kebutuhan Anda"}
          </p>
          <a
            href={userFeatures ? "/buat" : "/register"}
            className="inline-block rounded-full bg-ink px-8 py-3 text-sm font-medium text-white hover:bg-black"
          >
            {userFeatures ? "Buat Undangan" : "Mulai Sekarang"}
          </a>
        </div>
      </div>
    </section>
  );
}
