"use client";

import { FEATURE_LABELS } from "@/lib/features";

type FeatureListProps = {
  userFeatures: string[];
  paketNama?: string;
};

export function FeatureList({ userFeatures, paketNama }: FeatureListProps) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-8">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-ink">Fitur Anda</h3>
        {paketNama && (
          <p className="mt-1 text-sm text-ink-soft">
            Paket: <span className="font-medium text-ink">{paketNama}</span>
          </p>
        )}
      </div>

      {/* Feature Grid */}
      <div className="grid gap-3 md:grid-cols-2">
        {Object.entries(FEATURE_LABELS).map(([featureKey, label]) => {
          const hasFeature = userFeatures.includes(featureKey);
          return (
            <div
              key={featureKey}
              className={`flex items-start gap-3 rounded-lg p-3 ${
                hasFeature
                  ? "bg-accent/5 border border-accent/20"
                  : "bg-surface-2 border border-line opacity-50"
              }`}
            >
              <span
                className={`mt-0.5 text-lg ${
                  hasFeature ? "text-accent" : "text-ink-soft"
                }`}
              >
                {hasFeature ? "✓" : "○"}
              </span>
              <span className={`text-sm ${hasFeature ? "text-ink" : "text-ink-soft"}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Upgrade CTA */}
      {userFeatures.length < Object.keys(FEATURE_LABELS).length && (
        <div className="mt-8 pt-8 border-t border-line">
          <p className="text-sm text-ink-soft mb-4">
            Upgrade ke paket yang lebih tinggi untuk membuka lebih banyak fitur
          </p>
          <a
            href="/harga"
            className="inline-block rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white hover:bg-black transition-colors"
          >
            Lihat Paket Lain
          </a>
        </div>
      )}
    </div>
  );
}
