import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { createSnapTransaction } from "@/lib/midtrans";

/**
 * POST /api/checkout
 * Buat transaction untuk upgrade paket
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { paketId } = body;

    if (!paketId) {
      return NextResponse.json(
        { error: "paketId is required" },
        { status: 400 }
      );
    }

    // Get paket details
    const paket = await prisma.paket.findUnique({
      where: { id: paketId },
    });

    if (!paket) {
      return NextResponse.json({ error: "Paket not found" }, { status: 404 });
    }

    // Paket gratis (Uji Coba) tidak perlu checkout
    if (paket.harga === 0) {
      // Direct upgrade ke Uji Coba
      await prisma.user.update({
        where: { id: session.userId },
        data: { paketId },
      });

      return NextResponse.json({
        success: true,
        message: "Upgrade ke Uji Coba berhasil",
        redirectUrl: "/dashboard",
      });
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate unique order ID
    const orderId = `ORDER-${session.userId}-${Date.now()}`;

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.userId,
        paketId,
        amount: paket.harga,
        status: "pending",
        orderId,
      },
    });

    // Create Midtrans transaction
    const snapTransaction = await createSnapTransaction({
      orderId,
      amount: paket.harga,
      customerEmail: user.email,
      customerName: user.name || "Guest",
      customerPhone: "",
    });

    // Update transaction dengan Midtrans data
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        paymentUrl: snapTransaction.redirectUrl,
      },
    });

    return NextResponse.json({
      success: true,
      token: snapTransaction.token,
      redirectUrl: snapTransaction.redirectUrl,
      transactionId: transaction.id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/checkout/verify?orderId=xxx
 * Verifikasi status pembayaran
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderId = request.nextUrl.searchParams.get("orderId");
    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 }
      );
    }

    // Get transaction
    const transaction = await prisma.transaction.findUnique({
      where: { orderId },
      include: { paket: true },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (transaction.userId !== session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Jika sudah success, return langsung
    if (transaction.status === "success") {
      return NextResponse.json({
        status: "success",
        message: "Pembayaran berhasil",
        transaction,
      });
    }

    // TODO: Verify dengan Midtrans jika diperlukan
    // const midtransStatus = await verifyTransaction(orderId);

    return NextResponse.json({
      status: transaction.status,
      transaction,
    });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
