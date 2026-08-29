import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

/**
 * Check apakah user adalah admin
 */
export async function requireAdmin() {
  const session = await getSession();
  
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
