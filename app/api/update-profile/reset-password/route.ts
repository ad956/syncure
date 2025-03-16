import { NextResponse } from "next/server";
import dbConfig from "@utils/db";
import { errorHandler } from "@utils/error-handler";
import { STATUS_CODES } from "@utils/constants";
import getModelByRole from "@utils/get-model-by-role";
import hashPassword from "@utils/hash-password";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import { auth } from "@lib/auth";

export async function PUT(req: Request) {
  const session = await auth();

  if (!session) {
    return errorHandler("Unauthorized", STATUS_CODES.BAD_REQUEST);
  }
  const { id, role } = session.user;
  const { currentPassword, newPassword }: SecurityBody = await req.json();
  try {
    const user_id = new Types.ObjectId(id);

    if (!currentPassword || !newPassword) {
      return errorHandler(
        "Current password and new password are required",
        STATUS_CODES.BAD_REQUEST
      );
    }

    await dbConfig();
    const UserModel = getModelByRole(role);

    const user = await UserModel.findById(user_id);
    if (!user) {
      return errorHandler("User not found", STATUS_CODES.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return errorHandler(
        "Current password is incorrect",
        STATUS_CODES.BAD_REQUEST
      );
    }

    const hashedNewPassword = await hashPassword(newPassword);
    const updatedUser = await UserModel.findByIdAndUpdate(
      user_id,
      { $set: { password: hashedNewPassword } },
      { new: true }
    );

    if (!updatedUser) {
      return errorHandler("Error updating password", STATUS_CODES.SERVER_ERROR);
    }

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating password:", error);
    return errorHandler("Error updating password", STATUS_CODES.SERVER_ERROR);
  }
}
