import { NextResponse } from "next/server";
import Hospital from "@models/hospital";
import { Types } from "mongoose";

import dbConfig from "@utils/db";
import { errorHandler } from "@utils/error-handler";
import { STATUS_CODES } from "@utils/constants";
import { auth } from "@lib/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return errorHandler("Unauthorized", STATUS_CODES.BAD_REQUEST);
    }

    const hospital_id = new Types.ObjectId(session.user.id);

    await dbConfig();

    const hospitalData = await Hospital.findById(hospital_id);

    if (!hospitalData) {
      return errorHandler("Hospital not found", STATUS_CODES.NOT_FOUND);
    }

    return NextResponse.json(hospitalData, { status: 200 });
  } catch (error) {
    console.error("Error fetching Hospital data:", error);
    return errorHandler("Internal Server Error", STATUS_CODES.SERVER_ERROR);
  }
}
