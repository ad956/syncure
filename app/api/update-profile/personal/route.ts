import { NextResponse } from "next/server";
import dbConfig from "@utils/db";
import { errorHandler } from "@utils/error-handler";
import { STATUS_CODES } from "@utils/constants";
import getModelByRole from "@utils/get-model-by-role";
import { Types } from "mongoose";
import { auth } from "@lib/auth";
import { revalidateTag } from "next/cache";

export async function PUT(req: Request) {
  const session = await auth();

  if (!session) {
    return errorHandler("Unauthorized", STATUS_CODES.BAD_REQUEST);
  }

  const { id, role } = session.user;
  const updateData: PersonalInfoBody = await req.json();

  try {
    const user_id = new Types.ObjectId(id);

    await dbConfig();

    // Remove undefined fields
    Object.keys(updateData).forEach((key) => {
      if (updateData[key as keyof PersonalInfoBody] === undefined) {
        delete updateData[key as keyof PersonalInfoBody];
      }
    });

    const UserModel = getModelByRole(role);

    // Check for uniqueness of username, email, and contact
    if (updateData.username) {
      const existingUsername = await UserModel.findOne({
        username: updateData.username,
        _id: { $ne: user_id },
      });
      if (existingUsername) {
        return errorHandler(
          "Username already exists",
          STATUS_CODES.BAD_REQUEST
        );
      }
    }

    if (updateData.email) {
      const existingEmail = await UserModel.findOne({
        email: updateData.email,
        _id: { $ne: user_id },
      });
      if (existingEmail) {
        return errorHandler("Email already exists", STATUS_CODES.BAD_REQUEST);
      }
    }

    if (updateData.contact) {
      const existingContact = await UserModel.findOne({
        contact: updateData.contact,
        _id: { $ne: user_id },
      });
      if (existingContact) {
        return errorHandler(
          "Contact number already exists",
          STATUS_CODES.BAD_REQUEST
        );
      }
    }

    // Update the user
    const updatedUser = await UserModel.findByIdAndUpdate(
      user_id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return errorHandler(`${role} not found`, STATUS_CODES.NOT_FOUND);
    }

    revalidateTag("profile");

    return NextResponse.json(
      { message: "Profile updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating personal information:", error);
    return errorHandler(
      error.message || "Failed to update personal information",
      STATUS_CODES.SERVER_ERROR
    );
  }
}
