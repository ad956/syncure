import { NextResponse } from "next/server";
import DemoUser from "@models/demo-user";
import jwt from "jsonwebtoken";

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

    // Create JWT token for demo user
    const token = jwt.sign(
      {
        id: userData._id,
        email: userData.email,
        role: role,
      },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: userData._id,
          email: userData.email,
          firstname: userData.firstname,
          lastname: userData.lastname,
          role: role,
        },
        message: "Demo User logged in successfully.",
      },
      { status: 200 }
    );

    // Set auth cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error during demo login: ", error);
    return errorHandler("Internal Server Error", STATUS_CODES.SERVER_ERROR);
  }
}