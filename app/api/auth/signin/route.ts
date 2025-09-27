import { NextResponse } from "next/server";
import logUserActivity from "@lib/logs";
import dbConfig from "@utils/db";
import { errorHandler } from "@utils/error-handler";
import { allowedRoles, STATUS_CODES } from "@utils/constants";
import getModelByRole from "@utils/get-model-by-role";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

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

    // Optimize: Check roles in order of most common usage
    const orderedRoles = ["patient", "doctor", "receptionist", "hospital", "admin"];
    
    for (const role of orderedRoles) {
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

    // Parallel operations: Clear OTP and create JWT
    const [, token] = await Promise.all([
      getModelByRole(userRole).findByIdAndUpdate(user._id, { $set: { otp: "" } }),
      new SignJWT({
        user: {
          id: user._id.toString(),
          email: user.email,
          name: `${user.firstname} ${user.lastname}`,
          image: user.profile,
          role: userRole,
        }
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(new TextEncoder().encode(
          process.env.AUTH_SECRET || "your-secret-key-here"
        ))
    ]);

    // Log user activity asynchronously (don't wait)
    logUserActivity({
      username: user.username,
      name: `${user.firstname} ${user.lastname}`,
      email: user.email,
      role: userRole,
      action: "login",
    }, req).catch(error => console.error("Logging failed:", error));

    // Set cookie
    const cookieStore = cookies();
    cookieStore.set("better-auth.session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: `${user.firstname} ${user.lastname}`,
        image: user.profile,
        role: userRole,
      }
    });

  } catch (error) {
    console.error("Error during sign in:", error);
    return errorHandler("Internal Server Error", STATUS_CODES.SERVER_ERROR);
  }
}