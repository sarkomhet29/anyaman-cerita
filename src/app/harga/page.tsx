import { Navbar } from "@/components/anyaman/Navbar";
import { Pricing } from "@/components/anyaman/Pricing";
import { FeatureComparison } from "@/components/anyaman/FeatureComparison";
import { Footer } from "@/components/anyaman/Footer";

export default function HargaPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="bg-surface py-12">
          <div className="mx-auto max-w-5xl px-6">
            <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Paket Harga
            </h1>
            <p className="mt-2 text-ink-soft">
              Pilih paket yang sesuai dengan kebutuhan acara Anda.
            </p>
          </div>
        </section>
        <Pricing />
        <FeatureComparison />
      </main>
      <Footer />
    </>
  );
}
