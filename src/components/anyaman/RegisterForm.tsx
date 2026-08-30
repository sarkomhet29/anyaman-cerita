"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction, type RegisterState } from "@/app/register/actions";

const initialState: RegisterState = { error: null };

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-ink">
          Nama (opsional)
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          className={inputClass}
          placeholder="Nama lengkap Anda"
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
          autoComplete="email"
          className={inputClass}
          placeholder="nama@example.com"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-ink">
          Nomor WhatsApp
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          className={inputClass}
          placeholder="08xxxxxxxxxx"
        />
        <p className="mt-2 text-xs text-ink-soft">
          Dipakai untuk notifikasi verifikasi pembayaran via WhatsApp.
        </p>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-ink"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          className={inputClass}
          placeholder="Min. 8 karakter, 1 huruf besar, 1 angka"
        />
        <p className="mt-2 text-xs text-ink-soft">
          Password harus minimal 8 karakter, mengandung huruf besar, dan angka.
        </p>
      </div>

      {state.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-ink px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-black disabled:opacity-60"
      >
        {isPending ? "Mendaftar..." : "Daftar"}
      </button>

      <p className="text-center text-sm text-ink-soft">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="font-medium text-ink hover:underline"
        >
          Masuk di sini
        </Link>
      </p>
    </form>
  );
}

const inputClass =
  "mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-ink";
