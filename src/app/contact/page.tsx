import { Navbar } from "@/components/anyaman/Navbar";
import { Footer } from "@/components/anyaman/Footer";
import { ContactForm } from "@/components/anyaman/ContactForm";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-surface py-16">
        <div className="mx-auto max-w-2xl px-6">
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-ink">Hubungi Kami</h1>
            <p className="text-ink-soft mt-2">
              Ada pertanyaan atau butuh bantuan? Kami siap membantu Anda.
            </p>
          </div>

          {/* Contact Info */}
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <div className="rounded-2xl border border-line bg-surface-2 p-6">
              <div className="text-2xl mb-3">📧</div>
              <h3 className="font-semibold text-ink">Email</h3>
              <p className="text-sm text-ink-soft mt-2">support@anyamacerita.com</p>
            </div>

            <div className="rounded-2xl border border-line bg-surface-2 p-6">
              <div className="text-2xl mb-3">💬</div>
              <h3 className="font-semibold text-ink">WhatsApp</h3>
              <p className="text-sm text-ink-soft mt-2">+62 812-3456-7890</p>
            </div>

            <div className="rounded-2xl border border-line bg-surface-2 p-6">
              <div className="text-2xl mb-3">⏰</div>
              <h3 className="font-semibold text-ink">Jam Operasional</h3>
              <p className="text-sm text-ink-soft mt-2">Senin - Jumat, 09:00 - 18:00</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl border border-line bg-surface-2 p-8">
            <h2 className="text-xl font-bold text-ink mb-6">Kirim Pesan</h2>
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
