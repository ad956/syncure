import { NextRequest, NextResponse } from "next/server";
import razorpay from "@lib/razorpay/razorpay";
import { errorHandler, STATUS_CODES } from "@utils/index";

export async function POST(request: NextRequest) {
  try {
    const { amount, currency } = (await request.json()) as {
      amount: string;
      currency: string;
    };

    if (!amount || !currency) {
      return errorHandler(
        "Missing amount or currency",
        STATUS_CODES.BAD_REQUEST
      );
    }

    const options = {
      amount: amount,
      currency: currency,
      receipt: "rcp1",
    };

    const order = await razorpay.orders.create(options);

    if (!order || !order.id) {
      return errorHandler(
        "Failed to create Razorpay order",
        STATUS_CODES.SERVER_ERROR
      );
    }

    return NextResponse.json({ orderId: order.id }, { status: 200 });
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return errorHandler(
      error.message || "Internal Server Error",
      STATUS_CODES.SERVER_ERROR
    );
  }
}
