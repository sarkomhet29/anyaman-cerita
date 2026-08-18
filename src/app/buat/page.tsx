import { Navbar } from "@/components/anyaman/Navbar";
import { Footer } from "@/components/anyaman/Footer";
import { UndanganForm } from "@/components/anyaman/UndanganForm";

export default function BuatUndanganPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="flex-1 bg-surface py-20">
        <div className="mx-auto max-w-xl px-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Buat undanganmu
          </h1>
          <p className="mt-3 text-ink-soft">
            Isi detail acara di bawah ini. Semua bisa diubah lagi nanti.
          </p>
        </div>
        <div className="mt-14 px-6">
          <UndanganForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
