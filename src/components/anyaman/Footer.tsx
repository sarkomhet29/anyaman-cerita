import { WovenMark } from "./WovenMark";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface-2 py-12">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <WovenMark className="h-5 w-5" />
              <span className="text-sm font-semibold text-ink">Anyaman Cerita</span>
            </div>
            <p className="mt-3 text-sm text-ink-soft">
              Undangan digital untuk pernikahan, khitanan, aqiqah, dan momen
              spesial lainnya.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm sm:flex sm:gap-16">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
                Produk
              </p>
              <ul className="mt-3 space-y-2 text-ink-soft">
                <li><a href="#tema" className="hover:text-ink">Tema</a></li>
                <li><a href="#harga" className="hover:text-ink">Harga</a></li>
                <li><a href="#faq" className="hover:text-ink">Tanya Jawab</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
                Bantuan
              </p>
              <ul className="mt-3 space-y-2 text-ink-soft">
                <li><a href="https://wa.me/" className="hover:text-ink">WhatsApp Admin</a></li>
                <li><a href="#" className="hover:text-ink">Syarat & Ketentuan</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-ink-soft sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Anyaman Cerita.</span>
          <span>Indonesia</span>
        </div>
      </div>
    </footer>
  );
}
