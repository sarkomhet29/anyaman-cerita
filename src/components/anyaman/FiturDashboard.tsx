"use client";

import { useUserFeatures } from "@/hooks/useFeatures";
import { FeatureList } from "@/components/anyaman/FeatureList";
import { FEATURE_LABELS } from "@/lib/features";

export function FiturDashboard() {
  const { data: userFeatures, loading, error } = useUserFeatures();

  if (loading) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-8 animate-pulse">
        <div className="h-6 bg-surface-2 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-4 bg-surface-2 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !userFeatures) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-red-700">Gagal memuat fitur Anda</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-line bg-surface p-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Stats */}
          <div>
            <p className="text-sm text-ink-soft">Fitur Aktif</p>
            <p className="text-4xl font-bold text-ink mt-1">
              {userFeatures.features.length}
            </p>
            <p className="text-xs text-ink-soft mt-1">
              dari {Object.keys(FEATURE_LABELS).length} total fitur
            </p>
          </div>

          <div>
            <p className="text-sm text-ink-soft">Paket Saat Ini</p>
            <p className="text-2xl font-bold text-ink mt-1">
              {userFeatures.paket?.nama || "Uji Coba"}
            </p>
            {userFeatures.paket && (
              <p className="text-xs text-accent mt-1">
                {userFeatures.paket.harga === 0
                  ? "Gratis"
                  : `Rp${userFeatures.paket.harga.toLocaleString("id-ID")}`}
              </p>
            )}
          </div>

          <div className="flex flex-col justify-end">
            {userFeatures.features.length < Object.keys(FEATURE_LABELS).length ? (
              <a
                href="/harga"
                className="inline-block rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white hover:bg-black transition-colors"
              >
                Upgrade Sekarang
              </a>
            ) : (
              <div className="rounded-full bg-accent/10 px-6 py-2.5 text-sm font-medium text-accent text-center">
                ✓ Paket Premium
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feature List */}
      <FeatureList
        userFeatures={userFeatures.features}
        paketNama={userFeatures.paket?.nama}
      />
    </div>
  );
}
