import { Navbar } from "@/components/anyaman/Navbar";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { EditUndanganForm } from "@/components/anyaman/EditUndanganForm";

export default async function EditUndanganPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const undangan = await prisma.undangan.findUnique({
    where: { id },
  });

  if (!undangan) {
    notFound();
  }

  // Check ownership
  if (undangan.userId !== session.userId) {
    redirect("/dashboard");
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-surface py-16">
        <div className="mx-auto max-w-2xl px-6">
          <Link href={`/dashboard/undangan/${id}`} className="text-sm text-accent hover:underline mb-6 inline-block">
            ← Kembali
          </Link>

          <div className="rounded-2xl border border-line bg-surface-2 p-8">
            <h1 className="text-3xl font-bold text-ink">Edit Undangan</h1>
            <p className="text-ink-soft mt-2">Ubah detail undangan Anda kapan saja</p>

            <div className="mt-8">
              <EditUndanganForm undangan={undangan} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
