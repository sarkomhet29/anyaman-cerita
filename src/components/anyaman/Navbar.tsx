import Link from "next/link";
import { WovenMark } from "./WovenMark";
import { NavbarClient } from "./NavbarClient";
import { getSession } from "@/lib/session";

const links = [
  { label: "Tema", href: "/tema" },
  { label: "Kenapa Kami", href: "/kenapa-kami" },
  { label: "Harga", href: "/harga" },
  { label: "Tanya Jawab", href: "/tanya-jawab" },
];

export async function Navbar() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80">
          <WovenMark />
          <span className="text-[15px] font-semibold tracking-tight text-ink">
            Anyaman Cerita
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-ink-soft transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <NavbarClient session={session} />
      </nav>
    </header>
  );
}
