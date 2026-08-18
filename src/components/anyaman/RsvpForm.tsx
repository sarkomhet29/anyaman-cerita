"use client";

import { useActionState } from "react";
import { kirimRsvpAction, type RsvpState } from "@/app/u/[slug]/rsvp-actions";

const initialState: RsvpState = { error: null, success: false };

export function RsvpForm({
  undanganId,
  slug,
}: {
  undanganId: string;
  slug: string;
}) {
  const action = kirimRsvpAction.bind(null, undanganId, slug);
  const [state, formAction, isPending] = useActionState(action, initialState);

  if (state.success) {
    return (
      <div className="rounded-2xl border border-line bg-surface-2 px-6 py-8 text-center">
        <p className="text-lg font-semibold text-ink">Terima kasih!</p>
        <p className="mt-1 text-sm text-ink-soft">
          Konfirmasi dan ucapanmu sudah kami terima.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="nama" className="block text-sm font-medium text-ink">
          Nama
        </label>
        <input
          id="nama"
          name="nama"
          type="text"
          required
          placeholder="Nama lengkap"
          className={inputClass}
        />
      </div>

      <div>
        <span className="block text-sm font-medium text-ink">Konfirmasi kehadiran</span>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <label className="flex cursor-pointer items-center justify-center rounded-xl border border-line px-3 py-3 text-sm text-ink has-checked:border-ink has-checked:bg-surface-2 has-checked:font-medium">
            <input type="radio" name="kehadiran" value="hadir" required className="sr-only" />
            Hadir
          </label>
          <label className="flex cursor-pointer items-center justify-center rounded-xl border border-line px-3 py-3 text-sm text-ink has-checked:border-ink has-checked:bg-surface-2 has-checked:font-medium">
            <input type="radio" name="kehadiran" value="tidak_hadir" required className="sr-only" />
            Tidak Bisa Hadir
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="ucapan" className="block text-sm font-medium text-ink">
          Ucapan &amp; doa
          <span className="ml-2 font-normal text-ink-soft">Opsional</span>
        </label>
        <textarea
          id="ucapan"
          name="ucapan"
          rows={3}
          placeholder="Tulis ucapan untuk mereka..."
          className={inputClass}
        />
      </div>

      {state.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-ink px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-black disabled:opacity-60"
      >
        {isPending ? "Mengirim..." : "Kirim"}
      </button>
    </form>
  );
}

const inputClass =
  "mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-ink";
