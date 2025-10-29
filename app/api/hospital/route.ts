import Hospital from "@models/hospital";
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

    const hospital_id = new Types.ObjectId(session.user.id);
    await dbConfig();

    const projection = {
      role: 0,
      otp: 0,
      password: 0,
    };

    const hospitalData = await Hospital.findById(hospital_id, projection);

    if (!hospitalData) {
      return createErrorResponse("Hospital not found", 404);
    }

    return createSuccessResponse(hospitalData);
  } catch (error: any) {
    console.error("Error fetching hospital data:", { error: error.message });
    return createErrorResponse("Failed to fetch hospital data", 500);
  }
}