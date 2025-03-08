import dbConfig from "@utils/db";
import { NextResponse } from "next/server";
import { Patient, Doctor, Message, Room } from "@models/index";
import { pusherServer } from "@lib/pusher";
import { Types } from "mongoose";
import { capitalizedRole, errorHandler, STATUS_CODES } from "@utils/index";
import { auth } from "@lib/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();

    console.log("user is there ; " + session?.user.email);

    if (!session) {
      return errorHandler("Unauthorized", STATUS_CODES.BAD_REQUEST);
    }
    await dbConfig();

    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    if (!roomId) {
      return errorHandler("roomId is required", STATUS_CODES.BAD_REQUEST);
    }

    const messages = await Message.find({ roomId: new Types.ObjectId(roomId) })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("senderId", "firstname lastname profile")
      .sort({ createdAt: 1 });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return errorHandler("Failed to fetch messages", STATUS_CODES.SERVER_ERROR);
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    console.log("user is there ; " + session?.user.email);

    if (!session) {
      return errorHandler("Unauthorized", STATUS_CODES.BAD_REQUEST);
    }
    const _id = new Types.ObjectId(session.user.id);

    await dbConfig();
    const { roomId, message } = await req.json();

    if (!roomId || !message) {
      return errorHandler("Missing required fields", STATUS_CODES.BAD_REQUEST);
    }

    const newMessage = await Message.create({
      roomId: new Types.ObjectId(roomId),
      senderId: _id,
      senderRole: capitalizedRole(session.user.role),
      message,
    });

    // update room's lastMessage and timestamp
    await Room.findByIdAndUpdate(new Types.ObjectId(roomId), {
      lastMessage: newMessage._id,
      updatedAt: new Date(),
    });

    // trigger Pusher event
    await pusherServer.trigger(`chat-${roomId}`, "new-message", newMessage);

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    return errorHandler("Failed to send message", STATUS_CODES.SERVER_ERROR);
  }
}
