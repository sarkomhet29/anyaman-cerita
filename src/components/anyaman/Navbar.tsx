import { WovenMark } from "./WovenMark";

const links = [
  { label: "Tema", href: "#tema" },
  { label: "Kenapa Kami", href: "#kenapa" },
  { label: "Harga", href: "#harga" },
  { label: "Tanya Jawab", href: "#faq" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2">
          <WovenMark />
          <span className="text-[15px] font-semibold tracking-tight text-ink">
            Anyaman Cerita
          </span>
        </a>

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

        <div className="flex items-center gap-5">
          <a
            href="/dashboard"
            className="hidden text-sm text-ink-soft transition-colors hover:text-ink sm:block"
          >
            Dashboard
          </a>
          <a
            href="#mulai"
            className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-black"
          >
            Coba Gratis
          </a>
        </div>
      </nav>
    </header>
  );
}
