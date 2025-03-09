import { NextResponse } from "next/server";
import { OtpTemplate, sendEmail } from "@lib/emails";
import { render } from "@react-email/render";

import dbConfig from "@utils/db";
import { generateSecureOTP } from "@utils/generate-otp";
import getModelByRole from "@utils/get-model-by-role";
import { errorHandler } from "@utils/error-handler";
import { STATUS_CODES, allowedRoles } from "@utils/constants";

import bcrypt from "bcryptjs";

interface LoginBody {
  usernameOrEmail: string;
  password: string;
  role: string;
}

export async function POST(req: Request) {
  const body: LoginBody = await req.json();

  if (!body || !body.usernameOrEmail || !body.password || !body.role) {
    return errorHandler(
      "Invalid request body. Please provide username or email, password, and role.",
      STATUS_CODES.BAD_REQUEST
    );
  }

  if (!allowedRoles.includes(body.role)) {
    return errorHandler("User role isn't valid.", STATUS_CODES.BAD_REQUEST);
  }

  try {
    await dbConfig();

    const UserModel = getModelByRole(body.role);

    const user = await UserModel.findOne(
      {
        $or: [
          { email: body.usernameOrEmail },
          { username: body.usernameOrEmail },
        ],
      },
      { _id: 1, email: 1, firstname: 1, lastname: 1, password: 1 }
    );

    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      return errorHandler(
        "Invalid username/email or password",
        STATUS_CODES.UNAUTHORIZED
      );
    }

    const generatedOTP = generateSecureOTP();
    user.otp = generatedOTP;
    await user.save();

    const mailSent = await sendEmail({
      to: user.email,
      subject: "OTP Verification",
      html: render(OtpTemplate(user.firstname, generatedOTP)),
      from: {
        name: "Syncure",
        address: "support@patientfitnesstracker.com",
      },
    });

    if (!mailSent) {
      return errorHandler("Email Sending Failed", STATUS_CODES.SERVER_ERROR);
    }

    return NextResponse.json({ message: "ok" }, { status: 201 });
  } catch (error: any) {
    console.error("Error during login: ", error);
    return errorHandler("Internal Server Error", STATUS_CODES.SERVER_ERROR);
  }
}
