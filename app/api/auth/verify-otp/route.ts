import { NextResponse } from "next/server";
import logUserActivity from "@lib/logs";
import {
  allowedRoles,
  dbConfig,
  errorHandler,
  getModelByRole,
  STATUS_CODES,
} from "@utils/index";

type bodyType = {
  usernameOrEmail: string;
  otp: string;
  role: string;
  action: string;
};

export async function POST(req: Request) {
  try {
    const body: bodyType = await req.json();

    if (
      !body ||
      !body.usernameOrEmail ||
      !body.role ||
      !body.action ||
      !body.otp
    ) {
      return errorHandler(
        "Username/Email, OTP, action, and role are required fields in the request body.",
        STATUS_CODES.BAD_REQUEST
      );
    }

    if (!allowedRoles.includes(body.role)) {
      return errorHandler("User role isn't valid.", STATUS_CODES.BAD_REQUEST);
    }

    await dbConfig();

    const UserModel = getModelByRole(body.role);

    const user = await UserModel.findOne(
      {
        $or: [
          { email: body.usernameOrEmail },
          { username: body.usernameOrEmail },
        ],
      },
      {
        _id: 1,
        username: 1,
        firstname: 1,
        lastname: 1,
        otp: 1,
        email: 1,
        profile: 1,
      }
    );

    if (!user || user.otp !== body.otp) {
      return errorHandler("OTP Verification Failed", STATUS_CODES.UNAUTHORIZED);
    }

    await UserModel.findByIdAndUpdate(user._id, { $set: { otp: "" } });

    const userlog = {
      username: user.username,
      name: `${user.firstname} ${user.lastname}`,
      email: user.email,
      role: body.role,
      action: body.action,
    };

    // storing user logs in db
    await logUserActivity(userlog, req);

    return NextResponse.json(
      {
        id: user._id.toString(),
        email: user.email,
        name: `${user.firstname} ${user.lastname}`,
        image: user.profile,
        role: body.role,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during OTP verification:", error);
    return errorHandler("Internal Server Error", STATUS_CODES.SERVER_ERROR);
  }
}
