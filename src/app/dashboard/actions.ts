"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function ubahStatusAction(id: string, statusBaru: string) {
  if (statusBaru !== "draft" && statusBaru !== "aktif") {
    throw new Error("Status tidak valid");
  }
  await prisma.undangan.update({
    where: { id },
    data: { status: statusBaru },
  });
  revalidatePath("/dashboard");
}
