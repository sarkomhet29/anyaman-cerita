declare module 'midtrans-client' {
  interface MidtransTransactionParams {
    transaction_details: {
      order_id: string;
      gross_amount: number;
    };
    customer_details?: {
      email: string;
      first_name: string;
      phone?: string;
    };
  }

  interface MidtransTransactionResponse {
    token: string;
    redirect_url: string;
  }

  interface MidtransStatusResponse {
    transaction_status?: string;
    status_code?: string;
    order_id?: string;
    [key: string]: unknown;
  }

  export class Snap {
    constructor(options: {
      isProduction: boolean;
      serverKey?: string;
      clientKey?: string;
    });
    createTransaction(
      params: MidtransTransactionParams
    ): Promise<MidtransTransactionResponse>;
    transaction: {
      status(orderId: string): Promise<MidtransStatusResponse>;
    };
  }
}
