"use client";

import { useActionState, useState } from "react";
import {
  mulai2FAAction,
  konfirmasi2FAAction,
  nonaktifkan2FAAction,
  gantiPasswordAdminAction,
} from "@/app/panel-kelola/keamanan/actions";
import type {
  Aktifkan2FAState,
  GantiPasswordState,
} from "@/app/panel-kelola/keamanan/actions";

const tolak = { error: undefined, ok: undefined };

export function AdminKeamananClient({
  adminEmail,
  twoFactorEnabled,
  twoFactorSecret,
}: {
  adminEmail: string;
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
}) {
  const [gantiPassword, setGantiPassword] = useState(false);
  const [pwState, pwAction, pwPending] = useActionState(
    gantiPasswordAdminAction,
    tolak
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-line bg-surface-2 p-6">
        <h2 className="text-lg font-bold text-ink mb-4">
          Autentikasi Dua Faktor (2FA)
        </h2>

        {twoFactorEnabled ? (
          <div>
            <p className="text-sm text-green-700 bg-green-50 rounded-xl px-4 py-3">
              ✓ 2FA aktif. Setiap login admin wajib memasukkan kode dari
              Google Authenticator.
            </p>
            <form action={async () => { await nonaktifkan2FAAction(); }}>
              <button
                type="submit"
                className="rounded-full border border-red-300 px-6 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50"
              >
                Nonaktifkan 2FA
              </button>
            </form>
          </div>
        ) : twoFactorSecret ? (
          <div className="space-y-4">
            <ol className="list-decimal pl-5 text-sm text-ink space-y-2">
              <li>
                Buka aplikasi authenticator (Google Authenticator / Authy /
                Bitwarden), pilih <em>+</em> lalu{" "}
                <strong>masukkan kunci manual</strong>.
              </li>
              <li>
                Salin kunci rahasia berikut:
                <code className="mt-2 block select-all rounded-xl border border-line bg-surface px-4 py-3 font-mono text-xs break-all">
                  {twoFactorSecret}
                </code>
              </li>
              <li>
                Masukkan kode 6 digit yang muncul untuk mengonfirmasi aktivasi.
              </li>
            </ol>
            <Konfirmasi />
            <p className="text-xs text-ink-soft break-all">
              URL otpauth:{" "}
              <span className="font-mono">
                {`otpauth://totp/Anyaman%20Cerita:${adminEmail}?secret=${twoFactorSecret}&issuer=Anyaman%20Cerita`}
              </span>
            </p>
            <form action={async () => { await nonaktifkan2FAAction(); }}>
              <button
                type="submit"
                className="text-sm text-ink-soft hover:text-ink underline"
              >
                Batalkan setup
              </button>
            </form>
          </div>
        ) : (
          <div>
            <p className="text-sm text-ink-soft mb-4">
              Aktifkan 2FA (TOTP) untuk melindungi akun admin dari akses tak
              sah, kompatibel dengan Google Authenticator.
            </p>
            <form action={async () => { await mulai2FAAction(); }}>
              <button
                type="submit"
                className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white hover:bg-black"
              >
                Aktifkan 2FA
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-line bg-surface-2 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">Ganti Password</h2>
          <button
            type="button"
            onClick={() => setGantiPassword((v) => !v)}
            className="text-sm text-accent hover:underline"
          >
            {gantiPassword ? "Tutup" : "Ganti"}
          </button>
        </div>

        {gantiPassword && (
          <form action={pwAction} className="mt-4 space-y-4">
            <div>
              <label htmlFor="passwordLama" className="block text-sm font-medium text-ink">
                Password lama
              </label>
              <input
                id="passwordLama"
                name="passwordLama"
                type="password"
                required
                autoComplete="current-password"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="passwordBaru" className="block text-sm font-medium text-ink">
                Password baru
              </label>
              <input
                id="passwordBaru"
                name="passwordBaru"
                type="password"
                required
                autoComplete="new-password"
                className={inputClass}
              />
              <p className="mt-1 text-xs text-ink-soft">
                Minimal 10 karakter, kombinasi huruf besar/kecil, angka, dan simbol.
              </p>
            </div>

            {(pwState as GantiPasswordState).error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {(pwState as GantiPasswordState).error}
              </p>
            )}
            {(pwState as GantiPasswordState).ok && (
              <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                ✓ Password berhasil diganti.
              </p>
            )}

            <button
              type="submit"
              disabled={pwPending}
              className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-60"
            >
              {pwPending ? "Menyimpan..." : "Simpan Password Baru"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Konfirmasi() {
  const [state, formAction, pending] = useActionState(
    async (_prev: Aktifkan2FAState, formData: FormData) => {
      const hasil = await konfirmasi2FAAction(formData);
      return hasil.error
        ? ({ error: hasil.error, ok: undefined } as Aktifkan2FAState)
        : ({ error: undefined, ok: true } as Aktifkan2FAState);
    },
    { error: undefined, ok: undefined }
  );

  return (
    <form action={formAction} className="space-y-3">
      <div>
        <label htmlFor="kode2fa" className="block text-sm font-medium text-ink">
          Kode verifikasi 6 digit
        </label>
        <input
          id="kode2fa"
          name="kode"
          inputMode="numeric"
          required
          maxLength={6}
          placeholder="000000"
          className={inputClass}
        />
      </div>

      {state.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
          ✓ 2FA aktif.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-60"
      >
        {pending ? "Memproses..." : "Aktifkan Sekarang"}
      </button>
    </form>
  );
}

const inputClass =
  "mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-ink";