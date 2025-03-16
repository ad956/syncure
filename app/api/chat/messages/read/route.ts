import { NextResponse } from "next/server";
import { Message } from "@models/index";
import { Types } from "mongoose";

import dbConfig from "@utils/db";
import { errorHandler } from "@utils/error-handler";
import { STATUS_CODES } from "@utils/constants";

import { auth } from "@lib/auth";

export async function POST(req: Request) {
  const session = await auth();

  console.log("user is there ; " + session?.user.email);

  if (!session) {
    return errorHandler("Unauthorized", STATUS_CODES.BAD_REQUEST);
  }
  try {
    const _id = new Types.ObjectId(session.user.id);

    await dbConfig();
    const { roomId } = await req.json();

    if (!roomId) {
      return errorHandler("roomId is required", STATUS_CODES.BAD_REQUEST);
    }

    // mark all unread messages in the room as read
    await Message.updateMany(
      {
        roomId: new Types.ObjectId(roomId),
        senderId: { $ne: _id },
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return errorHandler(
      "Failed to mark messages as read",
      STATUS_CODES.SERVER_ERROR
    );
  }
}
