import { Navbar } from "@/components/anyaman/Navbar";
import { FAQ } from "@/components/anyaman/FAQ";
import { Footer } from "@/components/anyaman/Footer";

export default function TanyaJawabPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="bg-surface py-12">
          <div className="mx-auto max-w-5xl px-6">
            <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Tanya Jawab
            </h1>
            <p className="mt-2 text-ink-soft">
              Jawaban untuk pertanyaan umum tentang Anyaman Cerita.
            </p>
          </div>
        </section>
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
