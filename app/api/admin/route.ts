import Admin from "@models/admin";
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

    const admin_id = new Types.ObjectId(session.user.id);
    await dbConfig();

    const projection = {
      role: 0,
      otp: 0,
      password: 0,
    };

    const adminData = await Admin.findById(admin_id, projection);

    if (!adminData) {
      return createErrorResponse("Admin not found", 404);
    }

    return createSuccessResponse(adminData);
  } catch (error: any) {
    console.error("Error fetching admin data:", { error: error.message });
    return createErrorResponse("Failed to fetch admin data", 500);
  }
}