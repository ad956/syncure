import { NextResponse } from "next/server";
import DemoUser from "@models/demo-user";

import dbConfig from "@utils/db";
import { errorHandler } from "@utils/error-handler";
import { STATUS_CODES } from "@utils/constants";
import { generateSecureOTP } from "@utils/generate-otp";
import getModelByRole from "@utils/get-model-by-role";

export async function POST(req: Request) {
  const { role } = await req.json();

  try {
    if (!role || typeof role !== "string") {
      return errorHandler(
        "Invalid request body. Please provide a valid role.",
        STATUS_CODES.BAD_REQUEST
      );
    }

    await dbConfig();

    const generatedOTP = generateSecureOTP();

    // Parallel operations
    const [demoUser, UserModel] = await Promise.all([
      DemoUser.findOne({ role }),
      Promise.resolve(getModelByRole(role))
    ]);

    if (!demoUser) {
      return errorHandler(
        "Demo user not found for this role",
        STATUS_CODES.NOT_FOUND
      );
    }

    const userData = await UserModel.findByIdAndUpdate(
      demoUser.referenceId,
      { otp: generatedOTP },
      { new: true, select: 'username firstname lastname email role' }
    );

    if (!userData) {
      return errorHandler("Demo user data not found", STATUS_CODES.NOT_FOUND);
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          email: userData.email,
          otp: generatedOTP,
        },
        message: "Demo User logged in successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during demo login: ", error);
    return errorHandler("Internal Server Error", STATUS_CODES.SERVER_ERROR);
  }
}