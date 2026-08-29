import { Navbar } from "@/components/anyaman/Navbar";
import { ThemeGallery } from "@/components/anyaman/ThemeGallery";
import { Footer } from "@/components/anyaman/Footer";

export default function TemaPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="bg-surface py-12">
          <div className="mx-auto max-w-5xl px-6">
            <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Pilih Tema Undangan
            </h1>
            <p className="mt-2 text-ink-soft">
              Koleksi tema undangan digital yang indah untuk berbagai acara spesial Anda.
            </p>
          </div>
        </section>
        <ThemeGallery />
      </main>
      <Footer />
    </>
  );
}
