"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type RsvpState = {
  error: string | null;
  success: boolean;
};

export async function kirimRsvpAction(
  undanganId: string,
  slug: string,
  _prevState: RsvpState,
  formData: FormData
): Promise<RsvpState> {
  const nama = String(formData.get("nama") || "").trim();
  const kehadiran = String(formData.get("kehadiran") || "").trim();
  const ucapan = String(formData.get("ucapan") || "").trim();

  if (!nama || !kehadiran) {
    return { error: "Nama dan status kehadiran wajib diisi.", success: false };
  }

  if (kehadiran !== "hadir" && kehadiran !== "tidak_hadir") {
    return { error: "Status kehadiran tidak valid.", success: false };
  }

  await prisma.tamu.create({
    data: {
      undanganId,
      nama,
      kehadiran,
      ucapan: ucapan || null,
    },
  });

  revalidatePath(`/u/${slug}`);
  return { error: null, success: true };
}
