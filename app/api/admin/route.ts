import { NextRequest, NextResponse } from "next/server";
import { auth } from "@lib/auth";
import Admin from "@models/admin";

import dbConfig from "@utils/db";
import { errorHandler } from "@utils/error-handler";
import { STATUS_CODES } from "@utils/constants";

import { Types } from "mongoose";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return errorHandler("Unauthorized", STATUS_CODES.BAD_REQUEST);
    }

    const admin_id = new Types.ObjectId(session.user.id);
    await dbConfig();

    const adminData = await Admin.findById(admin_id);

    if (!adminData) {
      return errorHandler("Admin not found", STATUS_CODES.NOT_FOUND);
    }

    return NextResponse.json(adminData, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching Admin data route:", error);
    return errorHandler(error, STATUS_CODES.SERVER_ERROR);
  }
}
