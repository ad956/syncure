import { NextResponse } from "next/server";
import { pusherServer } from "@lib/pusher";
import { getSession } from "@lib/auth/get-session";
import { errorHandler } from "@utils/error-handler";
import { STATUS_CODES } from "@utils/constants";

export async function POST(req: Request) {
  const session = await getSession();

  if (!session) {
    return errorHandler("Unauthorized", STATUS_CODES.BAD_REQUEST);
  }

  try {
    const { roomId, isTyping } = await req.json();

    if (!roomId) {
      return errorHandler("roomId is required", STATUS_CODES.BAD_REQUEST);
    }

    await pusherServer.trigger(`chat-${roomId}`, "typing", {
      userId: (session as any).user.id,
      userName: (session as any).user.name,
      isTyping,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending typing indicator:", error);
    return errorHandler("Failed to send typing indicator", STATUS_CODES.SERVER_ERROR);
  }
}