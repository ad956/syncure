import { NextResponse } from "next/server";
import HospitalDetails from "@models/hospital_details";
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

    const hospitalDetailsData = await HospitalDetails.findOne({
      hospitalId: hospital_id,
    });

    if (!hospitalDetailsData) {
      return errorHandler("Hospital details not found", STATUS_CODES.NOT_FOUND);
    }

    return NextResponse.json(hospitalDetailsData, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching Hospital details:", error);
    return errorHandler(
      error.message || "Internal Server Error",
      STATUS_CODES.SERVER_ERROR
    );
  }
}
