"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/login/actions";

const initialState: LoginState = { error: null };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
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

      {state.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-ink px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-black disabled:opacity-60"
      >
        {isPending ? "Masuk..." : "Masuk"}
      </button>
    </form>
  );
}

const inputClass =
  "mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-ink";
