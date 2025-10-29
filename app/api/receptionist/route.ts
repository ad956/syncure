import dbConfig from "@utils/db";
import Receptionist from "@models/receptionist";
import { Types } from "mongoose";
import { getSession } from "@lib/auth/get-session";
import { createSuccessResponse, createErrorResponse } from "@lib/api-response";

export async function GET(request: Request) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return createErrorResponse("Unauthorized", 401);
    }

    const receptionist_id = new Types.ObjectId(session.user.id);
    await dbConfig();

    const projection = {
      role: 0,
      otp: 0,
      password: 0,
      current_hospital: 0,
    };

    const receptionistData = await Receptionist.findById(receptionist_id, projection);
    
    if (!receptionistData) {
      return createErrorResponse("Receptionist not found", 404);
    }

    return createSuccessResponse(receptionistData);
  } catch (error: any) {
    console.error("Error fetching receptionist data:", { error: error.message });
    return createErrorResponse("Failed to fetch receptionist data", 500);
  }
}
