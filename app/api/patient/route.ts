import Patient from "@models/patient";
import { Types } from "mongoose";
import { getSession } from "@lib/auth/get-session";
import dbConfig from "@utils/db";
import { createSuccessResponse, createErrorResponse } from "@lib/api-response";

export async function GET(request: Request) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return createErrorResponse("Unauthorized", 401);
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
      return createErrorResponse("Patient not found", 404);
    }

    return createSuccessResponse(patientData);
  } catch (error: any) {
    console.error("Error fetching patient data:", error);
    return createErrorResponse(error.message || "Internal Server Error", 500);
  }
}
