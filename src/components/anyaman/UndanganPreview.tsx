"use client";

import { useFormData } from "@/context/FormDataContext";

export function UndanganPreview() {
  const { formData } = useFormData();

  const formatTanggal = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const tanggalFormatted = formData.tanggalAcara
    ? formatTanggal.format(new Date(formData.tanggalAcara + "T00:00:00"))
    : "Tanggal belum dipilih";

  return (
    <div className="flex justify-center">
      {/* iPhone Frame - Responsive & Compact */}
      <div className="relative w-full max-w-xs">
        {/* iPhone Bezel */}
        <div className="relative aspect-[9/19.5] rounded-[35px] border-[6px] border-gray-900 bg-black shadow-2xl overflow-hidden">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1/20 bg-black rounded-b-2xl z-10" />

          {/* Screen Content */}
          <div className="absolute inset-0 rounded-[30px] bg-surface overflow-y-auto">
            {/* Status Bar */}
            <div className="sticky top-0 bg-surface-2 px-4 py-2 text-center text-xs text-ink border-b border-line">
              <div className="flex justify-between items-center text-[10px]">
                <span>9:41</span>
                <span>●●●●●</span>
              </div>
            </div>

            {/* Preview Content */}
            <div className="p-0">
              {/* Header */}
              <section className="border-b border-line py-6 text-center px-3">
                <span className="text-[7px] font-medium uppercase tracking-[0.15em] text-accent">
                  {formData.jenisAcara || "Acara"}
                </span>
                <h1 className="mt-1 text-sm font-bold tracking-tight text-ink line-clamp-2">
                  {formData.namaUtama || "Nama Acara"}
                </h1>
                <p className="mt-1.5 text-[11px] text-ink-soft">
                  {tanggalFormatted}
                  {formData.waktuAcara ? ` · ${formData.waktuAcara}` : ""}
                </p>
              </section>

              {/* Pesan Pembuka */}
              {formData.pesanUndangan && (
                <section className="border-b border-line py-6 px-3 text-center">
                  <p className="text-[10px] leading-relaxed text-ink-soft line-clamp-3">
                    {formData.pesanUndangan}
                  </p>
                </section>
              )}

              {/* Lokasi */}
              <section className="bg-surface-2 border-b border-line py-6 px-3">
                <div className="rounded-lg border border-line bg-surface px-2.5 py-2.5 text-center">
                  <p className="text-[7px] font-medium uppercase tracking-wide text-ink-soft">
                    Lokasi
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold text-ink line-clamp-2">
                    {formData.lokasi || "Nama Lokasi"}
                  </p>
                  {formData.alamatLengkap && (
                    <p className="mt-0.5 text-[8px] text-ink-soft line-clamp-2">
                      {formData.alamatLengkap}
                    </p>
                  )}
                  <button className="mt-1.5 inline-block rounded-full border border-line px-2.5 py-1 text-[7px] font-medium text-ink hover:border-ink">
                    Buka Maps
                  </button>
                </div>
              </section>

              {/* RSVP */}
              <section className="border-b border-line py-6 px-3 text-center">
                <h2 className="text-xs font-bold tracking-tight text-ink">
                  Konfirmasi Kehadiran
                </h2>
                <div className="mt-3 space-y-1.5">
                  <button className="w-full rounded-full bg-ink px-2.5 py-1.5 text-[10px] font-medium text-white">
                    Hadir
                  </button>
                  <button className="w-full rounded-full border border-line px-2.5 py-1.5 text-[10px] font-medium text-ink">
                    Tidak Hadir
                  </button>
                </div>
              </section>

              {/* Footer Spacing */}
              <div className="h-2" />
            </div>
          </div>
        </div>

        {/* iPhone Home Indicator */}
        <div className="flex justify-center mt-1.5">
          <div className="w-20 h-0.5 bg-gray-900 rounded-full" />
        </div>
      </div>
    </div>
  );
}
