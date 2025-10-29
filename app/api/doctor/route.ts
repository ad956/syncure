import Doctor from "@models/doctor";
import { Types } from "mongoose";
import dbConfig from "@utils/db";
import { getSession } from "@lib/auth/get-session";
import { createSuccessResponse, createErrorResponse } from "@lib/api-response";

export async function GET(request: Request) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return createErrorResponse("Unauthorized", 401);
    }

    const doctor_id = new Types.ObjectId(session.user.id);
    await dbConfig();

    const doctorData = await Doctor.findById(doctor_id);

    if (!doctorData) {
      return createErrorResponse("Doctor not found", 404);
    }

    return createSuccessResponse(doctorData);
  } catch (error: any) {
    console.error("Error fetching doctor data:", { error: error.message });
    return createErrorResponse("Failed to fetch doctor data", 500);
  }
}
