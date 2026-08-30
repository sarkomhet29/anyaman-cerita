import { getAdminSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

/**
 * Cek apakah user adalah admin — dipakai di halaman /panel-kelola/*,
 * server action admin, dan API /api/admin/*.
 * Autoritatif: cek sesi admin COOKIE + cek ulang role di database.
 */
export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, role: true },
  });

  if (!user || user.role !== "admin") {
    throw new Error("Forbidden: Admin access required");
  }

  return user;
}