"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";
import { hashPassword } from "@/lib/auth";

// ============================================================
// USER ACTIONS
// ============================================================

export async function updateUserRoleAction(formData: FormData) {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId"));
  const role = String(formData.get("role")) === "admin" ? "admin" : "user";

  // Admin tidak boleh mencabut role dirinya sendiri
  if (userId === admin.id && role === "user") {
    throw new Error("Anda tidak bisa mencabut role admin sendiri");
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
}

export async function updateUserPaketAction(formData: FormData) {
  await requireAdmin();
  const userId = String(formData.get("userId"));
  const paketId = String(formData.get("paketId"));

  await prisma.user.update({
    where: { id: userId },
    data: { paketId: paketId || null },
  });
  revalidatePath("/admin/users");
}

export async function resetUserPasswordAction(formData: FormData) {
  await requireAdmin();
  const userId = String(formData.get("userId"));
  const password = String(formData.get("password"));

  if (password.length < 8) {
    throw new Error("Password minimal 8 karakter");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { password: await hashPassword(password) },
  });
  revalidatePath("/admin/users");
}

export async function deleteUserAction(formData: FormData) {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId"));

  // Proteksi: admin tidak bisa menghapus akun sendiri
  if (userId === admin.id) {
    throw new Error("Anda tidak bisa menghapus akun sendiri");
  }

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
}

// ============================================================
// TRANSACTION ACTIONS
// ============================================================

export async function updateTransactionStatusAction(formData: FormData) {
  await requireAdmin();
  const transactionId = String(formData.get("transactionId"));
  const status = String(formData.get("status"));

  const valid = ["success", "pending", "failed", "expired"];
  if (!valid.includes(status)) {
    throw new Error("Status tidak valid");
  }

  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!transaction) {
    throw new Error("Transaksi tidak ditemukan");
  }

  await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      status,
      paidAt: status === "success" ? new Date() : null,
    },
  });

  // Jika sukses, otomatis upgrade paket user
  if (status === "success") {
    await prisma.user.update({
      where: { id: transaction.userId },
      data: { paketId: transaction.paketId },
    });
  }

  revalidatePath("/admin/transactions");
}

// ============================================================
// PAKET ACTIONS
// ============================================================

export async function createPaketAction(formData: FormData) {
  await requireAdmin();
  const nama = String(formData.get("nama")).trim();
  const harga = Number(formData.get("harga") || 0);
  const deskripsi = String(formData.get("deskripsi") || "").trim() || null;

  if (!nama) {
    throw new Error("Nama paket wajib diisi");
  }
  if (harga < 0) {
    throw new Error("Harga tidak boleh negatif");
  }

  const urutan = (await prisma.paket.count()) + 1;

  await prisma.paket.create({
    data: { nama, harga, deskripsi, urutan },
  });
  revalidatePath("/admin/paket");
}

export async function updatePaketAction(formData: FormData) {
  await requireAdmin();
  const paketId = String(formData.get("paketId"));
  const nama = String(formData.get("nama")).trim();
  const harga = Number(formData.get("harga") || 0);
  const deskripsi = String(formData.get("deskripsi") || "").trim() || null;

  if (!nama) {
    throw new Error("Nama paket wajib diisi");
  }

  await prisma.paket.update({
    where: { id: paketId },
    data: { nama, harga, deskripsi },
  });
  revalidatePath("/admin/paket");
}

export async function togglePaketHighlightAction(formData: FormData) {
  await requireAdmin();
  const paketId = String(formData.get("paketId"));
  const paket = await prisma.paket.findUnique({
    where: { id: paketId },
    select: { highlight: true },
  });

  if (paket) {
    await prisma.paket.update({
      where: { id: paketId },
      data: { highlight: !paket.highlight },
    });
  }
  revalidatePath("/admin/paket");
}

export async function deletePaketAction(formData: FormData) {
  await requireAdmin();
  const paketId = String(formData.get("paketId"));

  const paket = await prisma.paket.findUnique({
    where: { id: paketId },
    include: { _count: { select: { users: true } } },
  });

  if (!paket) {
    throw new Error("Paket tidak ditemukan");
  }
  if (paket._count.users > 0) {
    throw new Error("Paket masih dipakai user, tidak bisa dihapus");
  }

  await prisma.paketFitur.deleteMany({ where: { paketId } });
  await prisma.paket.delete({ where: { id: paketId } });
  revalidatePath("/admin/paket");
}

// ============================================================
// CONTACT INBOX ACTIONS
// ============================================================

export async function updateContactStatusAction(formData: FormData) {
  await requireAdmin();
  const messageId = String(formData.get("messageId"));
  const status = String(formData.get("status"));

  if (!["baru", "dibaca", "selesai"].includes(status)) {
    throw new Error("Status tidak valid");
  }

  await prisma.contactMessage.update({
    where: { id: messageId },
    data: { status },
  });
  revalidatePath("/admin/contact");
}

// ============================================================
// UNDANGAN ACTIONS
// ============================================================

export async function updateUndanganStatusAction(formData: FormData) {
  await requireAdmin();
  const undanganId = String(formData.get("undanganId"));
  const status = String(formData.get("status"));

  if (!["draft", "aktif"].includes(status)) {
    throw new Error("Status tidak valid");
  }

  await prisma.undangan.update({
    where: { id: undanganId },
    data: { status },
  });
  revalidatePath("/admin/undangan");
}

export async function deleteUndanganAction(formData: FormData) {
  await requireAdmin();
  const undanganId = String(formData.get("undanganId"));

  await prisma.undangan.delete({ where: { id: undanganId } });
  revalidatePath("/admin/undangan");
}