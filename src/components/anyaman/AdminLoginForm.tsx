"use client";

import { useActionState } from "react";
import {
  adminLoginAction,
  type AdminLoginState,
} from "@/app/panel-kelola/login/actions";

const awal: AdminLoginState = {
  error: null,
  perlu2FA: false,
  emailTerakhir: "",
};

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(adminLoginAction, awal);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink">
          Email admin
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          defaultValue={state.emailTerakhir}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-ink">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </div>

      {state.perlu2FA && (
        <div>
          <label htmlFor="kode2fa" className="block text-sm font-medium text-ink">
            Kode 2FA (Google Authenticator)
          </label>
          <input
            id="kode2fa"
            name="kode2fa"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="6 digit"
            className={inputClass}
          />
        </div>
      )}

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
        {isPending ? "Memproses..." : state.perlu2FA ? "Verifikasi 2FA" : "Masuk"}
      </button>

      <p className="text-center text-xs text-ink-soft">
        Area khusus admin. Percobaan login dipantau dan dibatasi.
      </p>
    </form>
  );
}

const inputClass =
  "mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-ink";