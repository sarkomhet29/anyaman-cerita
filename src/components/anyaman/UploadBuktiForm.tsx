"use client";

import { useActionState, useRef, useState } from "react";
import {
  kirimBuktiAction,
  type KirimBuktiState,
} from "@/app/dashboard/pembayaran/actions";

type UndanganPilihan = {
  id: string;
  slug: string;
  namaUtama: string;
  status: string;
};

const statusAwal: KirimBuktiState = { error: null, waAdminUrl: null };

export function UploadBuktiForm({
  transactionId,
  daftarUndangan,
}: {
  transactionId: string;
  daftarUndangan: UndanganPilihan[];
}) {
  const [state, formAction, isPending] = useActionState(
    kirimBuktiAction,
    statusAwal
  );
  const [buktiUrl, setBuktiUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [namaFile, setNamaFile] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Gagal mengunggah");
      }
      setBuktiUrl(data.url);
      setNamaFile(file.name);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Gagal mengunggah");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="transactionId" value={transactionId} />
      <input type="hidden" name="buktiUrl" value={buktiUrl} />

      {/* Pilih undangan yang akan diaktifkan */}
      <div>
        <label
          htmlFor="undanganId"
          className="block text-sm font-medium text-ink"
        >
          Pilih undangan yang akan diaktifkan
        </label>
        <select
          id="undanganId"
          name="undanganId"
          required
          defaultValue=""
          className="mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-ink"
        >
          <option value="" disabled>
            Pilih undangan
          </option>
          {daftarUndangan.map((u) => (
            <option key={u.id} value={u.id}>
              {u.namaUtama} ({u.status})
            </option>
          ))}
        </select>
        {daftarUndangan.length === 0 && (
          <p className="mt-2 text-xs text-ink-soft">
            Belum ada undangan. Buat dulu di halaman dashboard, lalu kembali ke
            sini.
          </p>
        )}
      </div>

      {/* Nomor WhatsApp klien (opsional) */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-ink"
        >
          Nomor WhatsApp (opsional)
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="08xxxxxxxxxx"
          className="mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-ink"
        />
        <p className="mt-1 text-xs text-ink-soft">
          Dipakai untuk notifikasi status verifikasi via WhatsApp.
        </p>
      </div>

      {/* Upload bukti transfer */}
      <div>
        <label className="block text-sm font-medium text-ink">
          Bukti transfer
        </label>
        <div className="mt-2">
          {buktiUrl ? (
            <div className="flex items-center gap-3 rounded-xl border border-line bg-surface-2 p-4">
              <span className="text-sm text-ink">{namaFile}</span>
              <button
                type="button"
                onClick={() => {
                  setBuktiUrl("");
                  setNamaFile("");
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="ml-auto text-xs text-accent hover:underline"
              >
                Ganti
              </button>
            </div>
          ) : (
            <label
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-line bg-surface-2 px-6 py-10 text-center transition-colors hover:border-ink ${
                uploading ? "pointer-events-none opacity-60" : ""
              }`}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={handleFile}
              />
              <span className="text-sm font-medium text-ink">
                {uploading ? "Mengunggah..." : "Klik untuk memilih gambar"}
              </span>
              <span className="mt-1 text-xs text-ink-soft">
                JPG/PNG/WEBP, maks 5 MB
              </span>
            </label>
          )}
        </div>
        {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
      </div>

      {state.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending || uploading || !buktiUrl}
        className="w-full rounded-full bg-ink px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-black disabled:opacity-60"
      >
        {isPending ? "Mengirim..." : "Kirim Bukti Transfer"}
      </button>

      {state.waAdminUrl && (
        <div className="rounded-xl border border-line bg-surface-2 p-4 text-sm text-ink">
          <p className="font-medium">Bukti terkirim.</p>
          <p className="mt-1 text-ink-soft">
            Pesanan sedang menunggu verifikasi admin. Kamu bisa mengingatkan
            admin lewat WhatsApp:
          </p>
          <a
            href={state.waAdminUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block rounded-full border border-line px-5 py-2 text-sm font-medium text-accent hover:border-ink"
          >
            Ingatkan Admin via WhatsApp
          </a>
        </div>
      )}
    </form>
  );
}
