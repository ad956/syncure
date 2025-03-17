import { NextResponse } from "next/server";
import DemoUser from "@models/demo-user";

import dbConfig from "@utils/db";
import { errorHandler } from "@utils/error-handler";
import { STATUS_CODES } from "@utils/constants";
import { generateSecureOTP } from "@utils/generate-otp";
import getModelByRole from "@utils/get-model-by-role";

export async function POST(req: Request) {
  await dbConfig();
  const { role } = await req.json();

  try {
    // validate the incoming body
    if (!role || typeof role !== "string") {
      return errorHandler(
        "Invalid request body. Please provide a valid role.",
        STATUS_CODES.BAD_REQUEST
      );
    }

    // find person with exact role in demo_users collection
    const demoUser = await DemoUser.findOne({ role });

    if (!demoUser) {
      return errorHandler(
        "Demo user not found for this role",
        STATUS_CODES.NOT_FOUND
      );
    }

    // get a user model with matching role
    const UserModel = getModelByRole(role);

    const generatedOTP = generateSecureOTP();

    // find a user which has the same ObjectId as demo users
    const userData = await UserModel.findByIdAndUpdate(demoUser.referenceId, {
      otp: generatedOTP,
    });

    if (!userData) {
      return errorHandler("Demo user data not found", STATUS_CODES.NOT_FOUND);
    }

    const userLog = {
      username: userData.username,
      name: `${userData.firstname} ${userData.lastname}`,
      email: userData.email,
      role: userData.role,
      action: "demouser-login",
    };

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
    console.error("Error during login: ", error);
    return errorHandler("Internal Server Error", STATUS_CODES.SERVER_ERROR);
  }
}
