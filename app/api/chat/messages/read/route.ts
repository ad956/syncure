import { NextRequest } from "next/server";
import { Message } from "@models/index";
import { Types } from "mongoose";
import dbConfig from "@utils/db";
import { getSession } from "@lib/auth/get-session";
import { createSuccessResponse, createErrorResponse, createValidationErrorResponse } from "@lib/api-response";
import { markAsReadSchema } from "@lib/validations/chat";

export async function POST(request: NextRequest) {
  try {
    await dbConfig();
    const session = await getSession();

    if (!session?.user?.id) {
      return createErrorResponse("Unauthorized access", 401);
    }

    const body = await request.json();
    const validation = markAsReadSchema.safeParse(body);
    
    if (!validation.success) {
      return createValidationErrorResponse(validation.error.errors);
    }

    const { roomId } = validation.data;
    const userId = new Types.ObjectId((session as any).user.id);

    // Mark all messages in the room as read for this user
    const result = await Message.updateMany(
      {
        roomId: new Types.ObjectId(roomId),
        senderId: { $ne: userId }, // Don't mark own messages as read
        isRead: false
      },
      {
        $set: { isRead: true }
      }
    );

    return createSuccessResponse({
      modifiedCount: result.modifiedCount
    }, "Messages marked as read");
  } catch (error: any) {
    console.error("Error marking messages as read:", error);
    return createErrorResponse(
      "Failed to mark messages as read", 
      500, 
      process.env.NODE_ENV === 'development' ? error.message : undefined
    );
  }
}