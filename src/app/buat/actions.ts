"use server";

import { prisma } from "@/lib/prisma";
import { buatSlug } from "@/lib/slug";
import { redirect } from "next/navigation";

export type BuatUndanganState = {
  error: string | null;
};

export async function buatUndanganAction(
  _prevState: BuatUndanganState,
  formData: FormData
): Promise<BuatUndanganState> {
  const jenisAcara = String(formData.get("jenisAcara") || "").trim();
  const namaUtama = String(formData.get("namaUtama") || "").trim();
  const tanggalAcara = String(formData.get("tanggalAcara") || "").trim();
  const waktuAcara = String(formData.get("waktuAcara") || "").trim();
  const lokasi = String(formData.get("lokasi") || "").trim();
  const alamatLengkap = String(formData.get("alamatLengkap") || "").trim();
  const tema = String(formData.get("tema") || "songket-senja").trim();
  const pesanUndangan = String(formData.get("pesanUndangan") || "").trim();

  // Validasi minimal di server — jangan percaya input dari client begitu saja
  if (!jenisAcara || !namaUtama || !tanggalAcara || !lokasi) {
    return { error: "Jenis acara, nama, tanggal, dan lokasi wajib diisi." };
  }

  const tanggal = new Date(tanggalAcara);
  if (Number.isNaN(tanggal.getTime())) {
    return { error: "Format tanggal tidak valid." };
  }

  const slug = buatSlug(namaUtama);

  const undangan = await prisma.undangan.create({
    data: {
      slug,
      jenisAcara,
      namaUtama,
      tanggalAcara: tanggal,
      waktuAcara: waktuAcara || null,
      lokasi,
      alamatLengkap: alamatLengkap || null,
      tema,
      pesanUndangan: pesanUndangan || null,
      status: "draft",
    },
  });

  redirect(`/buat/berhasil?slug=${undangan.slug}`);
}
