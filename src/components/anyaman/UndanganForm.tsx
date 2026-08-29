"use client";

import { useActionState, useEffect, useRef } from "react";
import { buatUndanganAction, type BuatUndanganState } from "@/app/buat/actions";
import { useFormData } from "@/context/FormDataContext";
import { useUserFeatures } from "@/hooks/useFeatures";
import { FEATURES } from "@/lib/features";

const jenisAcaraOptions = [
  "Pernikahan",
  "Khitanan",
  "Aqiqah",
  "Ulang Tahun",
  "Wisuda",
  "Syukuran",
  "Acara Custom",
];

const temaOptions = [
  { value: "songket-senja", label: "Songket Senja" },
];

const initialState: BuatUndanganState = { error: null };

export function UndanganForm({ preSelectedTema }: { preSelectedTema?: string }) {
  const [state, formAction, isPending] = useActionState(
    buatUndanganAction,
    initialState
  );
  const { updateFormData } = useFormData();
  const { data: userFeatures, loading: featuresLoading } = useUserFeatures();
  const features = userFeatures?.features ?? [];
  const updateFormDataRef = useRef(updateFormData);

  useEffect(() => {
    updateFormDataRef.current = updateFormData;
  });

  // Update preview saat form berubah
  useEffect(() => {
    const form = document.querySelector("form");
    if (!form) return;

    let timeoutId: NodeJS.Timeout;

    const handleFormChange = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const formDataObj = new FormData(form);
        const data: Record<string, string> = {};
        formDataObj.forEach((value, key) => {
          data[key] = String(value);
        });
        updateFormDataRef.current(data);
      }, 100);
    };

    form.addEventListener("change", handleFormChange);
    form.addEventListener("input", handleFormChange);

    // Initial update
    handleFormChange();

    return () => {
      form.removeEventListener("change", handleFormChange);
      form.removeEventListener("input", handleFormChange);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <form action={formAction} className="mx-auto max-w-xl">
      <div className="space-y-8">
        <Field label="Jenis acara" htmlFor="jenisAcara">
          <select
            id="jenisAcara"
            name="jenisAcara"
            required
            defaultValue=""
            className={selectClass}
          >
            <option value="" disabled>
              Pilih jenis acara
            </option>
            {jenisAcaraOptions.map((opsi) => (
              <option key={opsi} value={opsi}>
                {opsi}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Nama acara"
          htmlFor="namaUtama"
          hint="Contoh: Ayu & Bagas, atau Aqiqah Baby Alma"
        >
          <input
            id="namaUtama"
            name="namaUtama"
            type="text"
            required
            placeholder="Ayu & Bagas"
            className={inputClass}
          />
        </Field>

        <div className="grid gap-8 sm:grid-cols-2">
          <Field label="Tanggal acara" htmlFor="tanggalAcara">
            <input
              id="tanggalAcara"
              name="tanggalAcara"
              type="date"
              required
              className={inputClass}
            />
          </Field>

          <Field
            label="Waktu"
            htmlFor="waktuAcara"
            hint="Opsional"
          >
            <input
              id="waktuAcara"
              name="waktuAcara"
              type="text"
              placeholder="09.00 - selesai"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Nama lokasi" htmlFor="lokasi">
          <input
            id="lokasi"
            name="lokasi"
            type="text"
            required
            placeholder="Gedung Serbaguna Anggrek"
            className={inputClass}
          />
        </Field>

        <Field label="Alamat lengkap" htmlFor="alamatLengkap" hint="Opsional">
          <textarea
            id="alamatLengkap"
            name="alamatLengkap"
            rows={2}
            placeholder="Jl. Contoh No. 10, Bogor"
            className={inputClass}
          />
        </Field>

        <Field label="Tema" htmlFor="tema">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {temaOptions.map((opsi, i) => (
              <label
                key={opsi.value}
                className="flex cursor-pointer items-center justify-center rounded-xl border border-line px-3 py-3 text-center text-sm text-ink has-checked:border-ink has-checked:bg-surface-2 has-checked:font-medium"
              >
                <input
                  type="radio"
                  name="tema"
                  value={opsi.value}
                  defaultChecked={preSelectedTema === opsi.value || i === 0}
                  className="sr-only"
                />
                {opsi.label}
              </label>
            ))}
          </div>
        </Field>

        <Field
          label="Pesan pembuka"
          htmlFor="pesanUndangan"
          hint="Opsional — kalimat singkat di awal undangan"
        >
          <textarea
            id="pesanUndangan"
            name="pesanUndangan"
            rows={3}
            placeholder="Dengan penuh syukur, kami mengundang Bapak/Ibu..."
            className={inputClass}
          />
        </Field>

        {/* Feature-Gated Fields */}
        {features.includes(FEATURES.FOTO_GALERY_VIDEO) && (
          <Field label="Galeri Foto" htmlFor="galeri" hint="Opsional">
            <input
              id="galeri"
              name="galeri"
              type="text"
              placeholder="URL folder Google Drive atau link galeri"
              className={inputClass}
            />
          </Field>
        )}

        {features.includes(FEATURES.RATUSAN_MUSIK_CUSTOM) && (
          <Field label="Musik Latar" htmlFor="musik" hint="Opsional">
            <input
              id="musik"
              name="musik"
              type="text"
              placeholder="URL YouTube atau nama lagu"
              className={inputClass}
            />
          </Field>
        )}

        {features.includes(FEATURES.LINK_LIVE_STREAMING) && (
          <Field label="Link Live Streaming" htmlFor="liveStreaming" hint="Opsional">
            <input
              id="liveStreaming"
              name="liveStreaming"
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              className={inputClass}
            />
          </Field>
        )}

        {features.includes(FEATURES.COUNTDOWN_HARI_H) && (
          <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
            <p className="text-sm text-accent font-medium">
              ✓ Countdown Hari-H: Diaktifkan
            </p>
          </div>
        )}

        {/* Paket Info */}
        {!featuresLoading && userFeatures?.paket && (
          <div className="rounded-xl border border-line bg-surface-2 p-4">
            <p className="text-xs text-ink-soft">Paket Anda:</p>
            <p className="text-sm font-semibold text-ink">{userFeatures.paket.nama}</p>
            {features.length < 31 && (
              <a href="/harga" className="text-xs text-accent hover:underline mt-2 inline-block">
                Upgrade untuk lebih banyak fitur →
              </a>
            )}
          </div>
        )}
      </div>

      {state.error && (
        <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-10 w-full rounded-full bg-ink px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-black disabled:opacity-60"
      >
        {isPending ? "Menyimpan..." : "Buat Undangan"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-ink";

const selectClass = inputClass + " appearance-none";

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
        {label}
        {hint && <span className="ml-2 font-normal text-ink-soft">{hint}</span>}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
