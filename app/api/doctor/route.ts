import { NextResponse } from "next/server";
import Doctor from "@models/doctor";
import { Types } from "mongoose";

import dbConfig from "@utils/db";
import { errorHandler } from "@utils/error-handler";
import { STATUS_CODES } from "@utils/constants";
import { getSession } from "@lib/auth/get-session";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = await getSession();

  if (!session) {
    return errorHandler("Unauthorized", STATUS_CODES.UNAUTHORIZED);
  }
  try {
    const doctor_id = new Types.ObjectId((session as any).user.id);

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
