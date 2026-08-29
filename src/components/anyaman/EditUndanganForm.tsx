"use client";

import { useActionState } from "react";
import { editUndanganAction, type EditUndanganState } from "@/app/dashboard/undangan/actions";

type Undangan = {
  id: string;
  jenisAcara: string;
  namaUtama: string;
  tanggalAcara: Date;
  waktuAcara: string | null;
  lokasi: string;
  alamatLengkap: string | null;
  pesanUndangan: string | null;
};

const jenisAcaraOptions = [
  "Pernikahan",
  "Khitanan",
  "Aqiqah",
  "Ulang Tahun",
  "Wisuda",
  "Syukuran",
  "Acara Custom",
];

const initialState: EditUndanganState = { error: null };

export function EditUndanganForm({ undangan }: { undangan: Undangan }) {
  const editAction = editUndanganAction.bind(null, undangan.id);
  const [state, formAction, isPending] = useActionState(
    editAction,
    initialState
  );

  const tanggalInput = undangan.tanggalAcara.toISOString().split("T")[0];

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="jenisAcara" className="block text-sm font-medium text-ink">
          Jenis acara
        </label>
        <select
          id="jenisAcara"
          name="jenisAcara"
          required
          defaultValue={undangan.jenisAcara}
          className={inputClass}
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
      </div>

      <div>
        <label htmlFor="namaUtama" className="block text-sm font-medium text-ink">
          Nama acara
        </label>
        <input
          id="namaUtama"
          name="namaUtama"
          type="text"
          required
          defaultValue={undangan.namaUtama}
          placeholder="Ayu & Bagas"
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="tanggalAcara" className="block text-sm font-medium text-ink">
            Tanggal acara
          </label>
          <input
            id="tanggalAcara"
            name="tanggalAcara"
            type="date"
            required
            defaultValue={tanggalInput}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="waktuAcara" className="block text-sm font-medium text-ink">
            Waktu <span className="text-xs text-ink-soft">(opsional)</span>
          </label>
          <input
            id="waktuAcara"
            name="waktuAcara"
            type="text"
            defaultValue={undangan.waktuAcara || ""}
            placeholder="09.00 - selesai"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="lokasi" className="block text-sm font-medium text-ink">
          Nama lokasi
        </label>
        <input
          id="lokasi"
          name="lokasi"
          type="text"
          required
          defaultValue={undangan.lokasi}
          placeholder="Gedung Serbaguna Anggrek"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="alamatLengkap" className="block text-sm font-medium text-ink">
          Alamat lengkap <span className="text-xs text-ink-soft">(opsional)</span>
        </label>
        <textarea
          id="alamatLengkap"
          name="alamatLengkap"
          rows={2}
          defaultValue={undangan.alamatLengkap || ""}
          placeholder="Jl. Contoh No. 10, Bogor"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="pesanUndangan" className="block text-sm font-medium text-ink">
          Pesan pembuka <span className="text-xs text-ink-soft">(opsional)</span>
        </label>
        <textarea
          id="pesanUndangan"
          name="pesanUndangan"
          rows={3}
          defaultValue={undangan.pesanUndangan || ""}
          placeholder="Dengan penuh syukur, kami mengundang Bapak/Ibu..."
          className={inputClass}
        />
      </div>

      {state.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 rounded-full bg-ink px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-black disabled:opacity-60"
        >
          {isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
        <button
          type="reset"
          className="flex-1 rounded-full border border-line px-8 py-3.5 text-base font-medium text-ink hover:border-ink"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-ink";
