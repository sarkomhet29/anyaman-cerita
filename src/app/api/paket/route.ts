import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/paket
 * Get semua paket yang tersedia
 */
export async function GET() {
  try {
    const pakets = await prisma.paket.findMany({
      orderBy: { urutan: "asc" },
      select: {
        id: true,
        nama: true,
        harga: true,
        deskripsi: true,
        highlight: true,
      },
    });

    return NextResponse.json(pakets);
  } catch (error) {
    console.error("Error fetching pakets:", error);
    return NextResponse.json(
      { error: "Failed to fetch pakets" },
      { status: 500 }
    );
  }
}
