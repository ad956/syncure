import { NextResponse } from "next/server";
import dbConfig from "@utils/db";
import { errorHandler } from "@utils/error-handler";
import { STATUS_CODES } from "@utils/constants";
import getModelByRole from "@utils/get-model-by-role";
import { Types } from "mongoose";
import { revalidateTag } from "next/cache";
import { auth } from "@lib/auth";

export async function PUT(request: Request) {
  const session = await auth();

  if (!session) {
    return errorHandler("Unauthorized", STATUS_CODES.BAD_REQUEST);
  }

  const profile_pic = await request.json();

  try {
    const { id, role } = session.user;

    const user_id = new Types.ObjectId(id);
    await dbConfig();

    const UserModel = getModelByRole(role);

    const result = await UserModel.findByIdAndUpdate(
      user_id,
      { $set: { profile: profile_pic } },
      { new: true }
    );

    if (!result) {
      return errorHandler(
        "Error updating profile picture",
        STATUS_CODES.NOT_FOUND
      );
    }

    revalidateTag("profile");

    return NextResponse.json({ message: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return errorHandler("Internal Server Error", STATUS_CODES.SERVER_ERROR);
  }
}
