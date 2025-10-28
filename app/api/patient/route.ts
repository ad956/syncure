import Patient from "@models/patient";
import { Types } from "mongoose";
import dbConfig from "@utils/db";
import { createSuccessResponse, createErrorResponse } from "@lib/api-response";
import { requireAuth } from "@lib/auth/api-auth";

export async function GET(request: Request) {
  try {
    const { error, session } = requireAuth();
    
    if (error) {
      return error;
    }

    const patient_id = new Types.ObjectId(session!.user.id);
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

    return createSuccessResponse(patientData, "Patient data retrieved successfully");
  } catch (error: any) {
    console.error("Error fetching patient data:", error);
    return createErrorResponse(
      error.message || "Internal Server Error",
      500
    );
  }
}
