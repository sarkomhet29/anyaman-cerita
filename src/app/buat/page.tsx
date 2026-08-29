import { Navbar } from "@/components/anyaman/Navbar";
import { Footer } from "@/components/anyaman/Footer";
import { UndanganForm } from "@/components/anyaman/UndanganForm";
import { UndanganPreview } from "@/components/anyaman/UndanganPreview";
import { FormDataProvider } from "@/context/FormDataContext";

export default async function BuatUndanganPage({
  searchParams,
}: {
  searchParams: Promise<{ tema?: string }>;
}) {
  const { tema } = await searchParams;

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="flex-1 bg-surface py-20">
        <FormDataProvider>
          <div className="mx-auto max-w-7xl px-6">
            {/* Header */}
            <div className="mx-auto max-w-xl text-center mb-14">
              <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Buat undanganmu
              </h1>
              <p className="mt-3 text-ink-soft">
                Isi detail acara di bawah ini. Semua bisa diubah lagi nanti.
              </p>
            </div>

            {/* Form + Preview Grid */}
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Form */}
              <div>
                <UndanganForm preSelectedTema={tema} />
              </div>

              {/* Preview */}
              <div className="hidden lg:block">
                <div className="sticky top-24">
                  <UndanganPreview />
                </div>
              </div>
            </div>
          </div>
        </FormDataProvider>
      </main>
      <Footer />
    </div>
  );
}
