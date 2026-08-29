"use client";

import { useActionState } from "react";
import { contactAction, type ContactState } from "@/app/contact/actions";

const initialState: ContactState = { error: null, success: false };

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    contactAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-ink">
          Nama Lengkap
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Nama Anda"
          className="mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-ink"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="email@example.com"
          className="mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-ink"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-ink">
          Subjek
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          placeholder="Topik pertanyaan Anda"
          className="mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-ink"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-ink">
          Pesan
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Tuliskan pesan atau pertanyaan Anda..."
          className="mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-ink"
        />
      </div>

      {state.error && (
        <div className="rounded-lg bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">{state.error}</p>
        </div>
      )}

      {state.success && (
        <div className="rounded-lg bg-green-50 px-4 py-3">
          <p className="text-sm text-green-700">
            ✓ Pesan berhasil dikirim. Kami akan segera merespons.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || state.success}
        className="w-full rounded-full bg-ink px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-black disabled:opacity-60"
      >
        {isPending ? "Mengirim..." : state.success ? "Terkirim" : "Kirim Pesan"}
      </button>
    </form>
  );
}
