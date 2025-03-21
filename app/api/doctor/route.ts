import { NextResponse } from "next/server";
import Doctor from "@models/doctor";
import { Types } from "mongoose";

import dbConfig from "@utils/db";
import { errorHandler } from "@utils/error-handler";
import { STATUS_CODES } from "@utils/constants";
import { auth } from "@lib/auth";

export async function GET(request: Request) {
  const session = await auth();

  if (!session) {
    return errorHandler("Unauthorized", STATUS_CODES.BAD_REQUEST);
  }
  try {
    const doctor_id = new Types.ObjectId(session.user.id);

    await dbConfig();

    const doctorData = await Doctor.findById(doctor_id);

    if (!doctorData) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json(doctorData);
  } catch (error) {
    console.error("Error fetching Doctor data:", error);
    return errorHandler("Internal Server Error", STATUS_CODES.SERVER_ERROR);
  }
}
