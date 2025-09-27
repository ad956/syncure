import { NextResponse } from "next/server";
import { auth } from "@lib/auth";
import logUserActivity from "@lib/logs";
import dbConfig from "@utils/db";
import { errorHandler } from "@utils/error-handler";
import { allowedRoles, STATUS_CODES } from "@utils/constants";
import getModelByRole from "@utils/get-model-by-role";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || !body.email || !body.password) {
      return errorHandler(
        "Email and password (OTP) are required",
        STATUS_CODES.BAD_REQUEST
      );
    }

    await dbConfig();

    let user = null;
    let userRole = "";

    for (const role of allowedRoles) {
      const UserModel = getModelByRole(role);
      const foundUser = await UserModel.findOne(
        {
          $or: [
            { email: body.email },
            { username: body.email },
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

      if (foundUser && foundUser.otp === body.password) {
        user = foundUser;
        userRole = role;
        break;
      }
    }

    if (!user) {
      return errorHandler("Invalid credentials", STATUS_CODES.UNAUTHORIZED);
    }

    const UserModel = getModelByRole(userRole);
    await UserModel.findByIdAndUpdate(user._id, { $set: { otp: "" } });

    const userlog = {
      username: user.username,
      name: `${user.firstname} ${user.lastname}`,
      email: user.email,
      role: userRole,
      action: "login",
    };
    await logUserActivity(userlog, req);

    // Use Better Auth to create session
    const session = await auth.api.signInEmail({
      body: {
        email: user.email,
        password: body.password,
      },
    });

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: `${user.firstname} ${user.lastname}`,
        image: user.profile,
        role: userRole,
      },
      session
    });

  } catch (error) {
    console.error("Error during sign in:", error);
    return errorHandler("Internal Server Error", STATUS_CODES.SERVER_ERROR);
  }
}