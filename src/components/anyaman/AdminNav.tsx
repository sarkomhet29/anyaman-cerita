import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { adminLogoutAction } from "@/app/panel-kelola/login/actions";

type MenuItem = {
  key: string;
  label: string;
  href: string;
  badge?: boolean;
};

const MENU: MenuItem[] = [
  { key: "ringkasan", label: "Ringkasan", href: "/panel-kelola" },
  { key: "pesanan", label: "Pesanan", href: "/panel-kelola/pesanan", badge: true },
  { key: "paket", label: "Paket", href: "/panel-kelola/paket" },
  { key: "undangan", label: "Undangan", href: "/panel-kelola/undangan" },
  { key: "users", label: "Pengguna", href: "/panel-kelola/users" },
  { key: "transaksi", label: "Transaksi", href: "/panel-kelola/transactions" },
  { key: "pesan", label: "Pesan", href: "/panel-kelola/contact" },
  { key: "keamanan", label: "Keamanan", href: "/panel-kelola/keamanan" },
];

/**
 * Menu navigasi admin. Bukan komponen client — aktif di-set lewat prop `active`.
 * Badge "Pesanan" menampilkan jumlah pesanan yang masih menunggu verifikasi.
 */
export async function AdminNav({ active }: { active: string }) {
  const menunggu = await prisma.transaction.count({
    where: { paymentMethod: "manual", status: "menunggu_verifikasi" },
  });

  return (
    <nav className="border-b border-line bg-surface-2/50">
      <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-6 py-3">
        {MENU.map((item) => {
          const isActive = item.key === active;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-ink text-white"
                  : "text-ink-soft hover:bg-surface-2 hover:text-ink"
              }`}
            >
              {item.label}
              {item.badge && menunggu > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-white">
                  {menunggu}
                </span>
              )}
            </Link>
          );
        })}

        <div className="ml-auto">
          <form action={adminLogoutAction}>
            <button
              type="submit"
              className="whitespace-nowrap rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-soft hover:border-ink hover:text-ink"
            >
              Keluar
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}