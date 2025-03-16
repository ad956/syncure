import { NextResponse } from "next/server";
import dbConfig from "@utils/db";
import { errorHandler } from "@utils/error-handler";
import { STATUS_CODES } from "@utils/constants";
import getModelByRole from "@utils/get-model-by-role";
import { Types } from "mongoose";
import { auth } from "@lib/auth";

export async function PUT(req: Request) {
  const session = await auth();

  if (!session) {
    return errorHandler("Unauthorized", STATUS_CODES.BAD_REQUEST);
  }

  const { id, role } = session.user;
  const addressData: AddressBody = await req.json();

  try {
    const user_id = new Types.ObjectId(id);

    await dbConfig();

    // remove undefined fields
    Object.keys(addressData).forEach((key) => {
      if (addressData[key as keyof AddressBody] === undefined) {
        delete addressData[key as keyof AddressBody];
      }
    });

    const UserModel = getModelByRole(role);
    const user = await UserModel.findById(user_id);

    if (!user) {
      return errorHandler(`${role} not found`, STATUS_CODES.NOT_FOUND);
    }

    const updatedAddress = {
      address_line_1: user.address.address_line_1,
      address_line_2: user.address.address_line_2,
      city: user.address.city,
      state: user.address.state,
      zip_code: user.address.zip_code,
      country: user.address.country,
      ...addressData,
    };

    user.address = updatedAddress;
    await user.save();

    return NextResponse.json({ message: "ok" }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating address:", error);
    return errorHandler(
      error.message || "Error updating address",
      STATUS_CODES.SERVER_ERROR
    );
  }
}
