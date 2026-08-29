import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
  isProduction: process.env.NODE_ENV === "production",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export interface MidtransTransactionParams {
  orderId: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
}

/**
 * Buat transaction token untuk Midtrans Snap
 */
export async function createSnapTransaction(params: MidtransTransactionParams) {
  try {
    const transactionDetails = {
      order_id: params.orderId,
      gross_amount: params.amount,
    };

    const customerDetails = {
      email: params.customerEmail,
      first_name: params.customerName,
      phone: params.customerPhone || "",
    };

    const transaction = await snap.createTransaction({
      transaction_details: transactionDetails,
      customer_details: customerDetails,
    });

    return {
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
    };
  } catch (error) {
    console.error("Midtrans error:", error);
    throw new Error("Gagal membuat transaksi Midtrans");
  }
}

/**
 * Verify transaction status dari Midtrans
 */
export async function verifyTransaction(orderId: string) {
  try {
    const status = await snap.transaction.status(orderId);
    return status;
  } catch (error) {
    console.error("Midtrans verify error:", error);
    throw new Error("Gagal verifikasi transaksi");
  }
}

/**
 * Check transaction status
 */
export function getTransactionStatus(
  status: string
): "success" | "pending" | "failed" {
  if (
    status === "capture" ||
    status === "settlement" ||
    status === "success"
  ) {
    return "success";
  } else if (status === "pending") {
    return "pending";
  } else {
    return "failed";
  }
}
