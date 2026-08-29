import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { userHasFeature, getUserFeatures, getUserPaket } from "@/lib/paket";

/**
 * GET /api/fitur
 * Get semua fitur yang dimiliki user yang sedang login
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const features = await getUserFeatures(session.userId);
    const paket = await getUserPaket(session.userId);

    return NextResponse.json({
      features,
      paket: paket ? {
        id: paket.id,
        nama: paket.nama,
        harga: paket.harga,
      } : null,
    });
  } catch (error) {
    console.error("Error fetching features:", error);
    return NextResponse.json(
      { error: "Failed to fetch features" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/fitur/check
 * Check apakah user punya akses ke fitur tertentu
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { featureKey } = body;

    if (!featureKey) {
      return NextResponse.json(
        { error: "featureKey is required" },
        { status: 400 }
      );
    }

    const hasAccess = await userHasFeature(session.userId, featureKey);

    return NextResponse.json({ hasAccess, featureKey });
  } catch (error) {
    console.error("Error checking feature:", error);
    return NextResponse.json(
      { error: "Failed to check feature" },
      { status: 500 }
    );
  }
}
