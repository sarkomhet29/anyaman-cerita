import { prisma } from "@/lib/prisma";
import { FEATURES } from "@/lib/features";

/**
 * Check apakah user memiliki akses ke fitur tertentu
 */
export async function userHasFeature(
  userId: string,
  featureKey: string
): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        paket: {
          include: {
            fitur: true,
          },
        },
      },
    });

    if (!user || !user.paket) {
      // User belum punya paket (belum upgrade)
      return featureKey === FEATURES.GANTI_TEMA ||
        featureKey === FEATURES.UBAH_NAMA_TAMU ||
        featureKey === FEATURES.RSVP_UCAPAN; // Fitur uji coba
    }

    const hasFeature = user.paket.fitur.some((f) => f.fiturKey === featureKey);
    return hasFeature;
  } catch (error) {
    console.error("Error checking feature:", error);
    return false;
  }
}

/**
 * Get semua fitur yang dimiliki user
 */
export async function getUserFeatures(userId: string): Promise<string[]> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        paket: {
          include: {
            fitur: true,
          },
        },
      },
    });

    if (!user || !user.paket) {
      // Return fitur uji coba
      return [
        FEATURES.GANTI_TEMA,
        FEATURES.UBAH_NAMA_TAMU,
        FEATURES.RSVP_UCAPAN,
      ];
    }

    return user.paket.fitur.map((f) => f.fiturKey);
  } catch (error) {
    console.error("Error getting user features:", error);
    return [];
  }
}

/**
 * Get detail paket user
 */
export async function getUserPaket(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        paket: {
          include: {
            fitur: true,
          },
        },
      },
    });

    return user?.paket || null;
  } catch (error) {
    console.error("Error getting user paket:", error);
    return null;
  }
}

/**
 * Upgrade user ke paket baru
 */
export async function upgradePaket(userId: string, paketNama: string) {
  try {
    const paket = await prisma.paket.findUnique({
      where: { nama: paketNama },
    });

    if (!paket) {
      throw new Error(`Paket "${paketNama}" tidak ditemukan`);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { paketId: paket.id },
      include: {
        paket: {
          include: {
            fitur: true,
          },
        },
      },
    });

    return updated;
  } catch (error) {
    console.error("Error upgrading paket:", error);
    throw error;
  }
}
