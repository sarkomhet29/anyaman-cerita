"use client";

import Link from "next/link";
import { SessionPayload } from "@/lib/session";

export function NavbarClient({ session }: { session: SessionPayload | null }) {
  return (
    <div className="flex items-center gap-5">
      {session ? (
        <>
          <Link
            href="/dashboard"
            className="hidden text-sm text-ink-soft transition-colors hover:text-ink sm:block"
          >
            Dashboard
          </Link>
          <span className="hidden text-xs text-ink-soft sm:block">
            {session.email}
          </span>
          <form
            action="/api/logout"
            method="POST"
            className="flex items-center gap-3"
          >
            <button
              type="submit"
              className="rounded-full bg-surface-2 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-3"
            >
              Keluar
            </button>
          </form>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="text-sm text-ink-soft transition-colors hover:text-ink"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Daftar
          </Link>
        </>
      )}
    </div>
  );
}
