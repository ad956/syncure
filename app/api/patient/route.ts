import { NextResponse } from "next/server";
import Patient from "@models/patient";
import { dbConfig, errorHandler, STATUS_CODES } from "@utils/index";
import { Types } from "mongoose";
import { auth } from "@lib/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return errorHandler("Unauthorized", STATUS_CODES.BAD_REQUEST);
    }

    const patient_id = new Types.ObjectId(session.user.id);
    await dbConfig();

    const projection = {
      role: 0,
      otp: 0,
      password: 0,
      current_hospital: 0,
    };

    const patientData = await Patient.findById(patient_id, projection);

    if (!patientData) {
      return errorHandler("Patient not found", STATUS_CODES.NOT_FOUND);
    }

    return NextResponse.json(patientData, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching patient data:", error);
    return errorHandler(
      error.message || "Internal Server Error",
      STATUS_CODES.SERVER_ERROR
    );
  }
}
