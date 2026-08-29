import { Navbar } from "@/components/anyaman/Navbar";
import { WhyUs } from "@/components/anyaman/WhyUs";
import { FeatureGrid } from "@/components/anyaman/FeatureGrid";
import { Footer } from "@/components/anyaman/Footer";

export default function KenayaKamiPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="bg-surface py-12">
          <div className="mx-auto max-w-5xl px-6">
            <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Kenapa Memilih Kami
            </h1>
            <p className="mt-2 text-ink-soft">
              Alasan mengapa Anyaman Cerita adalah pilihan terbaik untuk undangan digital Anda.
            </p>
          </div>
        </section>
        <WhyUs />
        <FeatureGrid />
      </main>
      <Footer />
    </>
  );
}
