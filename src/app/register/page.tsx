import { Navbar } from "@/components/anyaman/Navbar";
import { RegisterForm } from "@/components/anyaman/RegisterForm";
import { WovenMark } from "@/components/anyaman/WovenMark";

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-center justify-center bg-surface px-6 py-24">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center">
            <WovenMark className="h-8 w-8" />
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink">
              Buat Akun Baru
            </h1>
            <p className="mt-1 text-sm text-ink-soft">Anyaman Cerita</p>
          </div>
          <RegisterForm />
        </div>
      </main>
    </>
  );
}
