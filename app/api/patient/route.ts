import { NextResponse } from "next/server";
import Patient from "@models/patient";
import { Types } from "mongoose";
// TODO: Import Better Auth

import dbConfig from "@utils/db";
import { errorHandler } from "@utils/error-handler";
import { STATUS_CODES } from "@utils/constants";

export async function GET() {
  // TODO: Replace with Better Auth session validation
  // const session = await auth();

  // console.log("session : " + session);

  // if (!session) {
  //   return errorHandler("Unauthorized", STATUS_CODES.BAD_REQUEST);
  // }
  try {
    // TODO: Get patient ID from Better Auth session
    const patient_id = new Types.ObjectId('temp-patient-id');
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

    console.table(patientData);

    return NextResponse.json(patientData, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching patient data:", error);
    return errorHandler(
      error.message || "Internal Server Error",
      STATUS_CODES.SERVER_ERROR
    );
  }
}
