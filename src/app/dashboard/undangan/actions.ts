"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export type EditUndanganState = {
  error: string | null;
};

export async function editUndanganAction(
  undanganId: string,
  _prevState: EditUndanganState,
  formData: FormData
): Promise<EditUndanganState> {
  // Get session untuk verify ownership
  const session = await getSession();
  if (!session) {
    return { error: "Anda harus login terlebih dahulu." };
  }

  // Verify ownership
  const undangan = await prisma.undangan.findUnique({
    where: { id: undanganId },
  });

  if (!undangan || undangan.userId !== session.userId) {
    return { error: "Anda tidak memiliki akses ke undangan ini." };
  }

  const jenisAcara = String(formData.get("jenisAcara") || "").trim();
  const namaUtama = String(formData.get("namaUtama") || "").trim();
  const tanggalAcara = String(formData.get("tanggalAcara") || "").trim();
  const waktuAcara = String(formData.get("waktuAcara") || "").trim();
  const lokasi = String(formData.get("lokasi") || "").trim();
  const alamatLengkap = String(formData.get("alamatLengkap") || "").trim();
  const pesanUndangan = String(formData.get("pesanUndangan") || "").trim();

  // Validasi
  if (!jenisAcara || !namaUtama || !tanggalAcara || !lokasi) {
    return { error: "Jenis acara, nama, tanggal, dan lokasi wajib diisi." };
  }

  const tanggal = new Date(tanggalAcara);
  if (Number.isNaN(tanggal.getTime())) {
    return { error: "Format tanggal tidak valid." };
  }

  // Update undangan
  await prisma.undangan.update({
    where: { id: undanganId },
    data: {
      jenisAcara,
      namaUtama,
      tanggalAcara: tanggal,
      waktuAcara: waktuAcara || null,
      lokasi,
      alamatLengkap: alamatLengkap || null,
      pesanUndangan: pesanUndangan || null,
    },
  });

  redirect(`/dashboard/undangan/${undanganId}`);
}
