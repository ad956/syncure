import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { errorHandler } from "@utils/error-handler";
import { STATUS_CODES } from "@utils/constants";

const generatedSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string
) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new Error(
      "Razorpay key secret is not defined in environment variables."
    );
  }
  return crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");
};

export async function POST(request: NextRequest) {
  try {
    const { orderCreationId, razorpayPaymentId, razorpaySignature } =
      await request.json();

    const signature = generatedSignature(orderCreationId, razorpayPaymentId);
    if (signature !== razorpaySignature) {
      return errorHandler(
        "Payment verification failed",
        STATUS_CODES.BAD_REQUEST
      );
    }

    return NextResponse.json(
      { message: "Payment verified successfully", isOk: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error during payment verification:", error);
    return errorHandler(
      error.message || "Internal Server Error",
      STATUS_CODES.SERVER_ERROR
    );
  }
}
