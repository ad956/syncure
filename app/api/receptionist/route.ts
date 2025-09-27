import { NextResponse } from "next/server";
import dbConfig from "@utils/db";
import { errorHandler } from "@utils/error-handler";
import { STATUS_CODES } from "@utils/constants";
import Receptionist from "@models/receptionist";
import { Types } from "mongoose";
import { auth } from "@lib/auth";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return errorHandler("Unauthorized", STATUS_CODES.UNAUTHORIZED);
  }

  try {
    const receptionist_id = new Types.ObjectId(session.user.id);
    await dbConfig();

    const projection = {
      role: 0,
      otp: 0,
      password: 0,
      current_hospital: 0,
    };

    const receptionistData = await Receptionist.findById(
      receptionist_id,
      projection
    );
    if (!receptionistData) {
      return errorHandler("Receptionist not found", STATUS_CODES.NOT_FOUND);
    }

    return NextResponse.json(receptionistData, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching receptionist data route:", error);
    return errorHandler(
      error.message || "Internal Server Error",
      STATUS_CODES.SERVER_ERROR
    );
  }
}
