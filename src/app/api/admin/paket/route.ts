import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireAdmin();

    const pakets = await prisma.paket.findMany({
      include: {
        _count: {
          select: { users: true, fitur: true, transactions: true },
        },
        fitur: true,
      },
      orderBy: { urutan: "asc" },
    });

    return NextResponse.json(pakets);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
