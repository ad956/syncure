import { NextRequest } from "next/server";
import { Room } from "@models/index";
import { Types } from "mongoose";
import dbConfig from "@utils/db";
import { getSession } from "@lib/auth/get-session";
import { createSuccessResponse, createErrorResponse, createValidationErrorResponse } from "@lib/api-response";
import { getRoomsSchema } from "@lib/validations/chat";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await dbConfig();
    const session = await getSession();

    if (!session?.user?.id) {
      return createErrorResponse("Unauthorized access", 401);
    }

    const { searchParams } = new URL(request.url);
    const queryParams = {
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    };

    const validation = getRoomsSchema.safeParse(queryParams);
    if (!validation.success) {
      return createValidationErrorResponse(validation.error.errors);
    }

    const { page, limit } = validation.data;
    const userId = new Types.ObjectId((session as any).user.id);

    const rooms = await Room.find({
      "participants.userId": userId
    })
      .populate("participants.userId", "firstname lastname profile specialty")
      .populate("lastMessage")
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return createSuccessResponse({
      rooms,
      pagination: {
        page,
        limit,
        hasMore: rooms.length === limit
      }
    });
  } catch (error: any) {
    console.error("Error fetching rooms:", error);
    return createErrorResponse(
      "Failed to fetch chat rooms", 
      500, 
      process.env.NODE_ENV === 'development' ? error.message : undefined
    );
  }
}