import { NextResponse } from "next/server";
import { Patient, Doctor, Message, Room } from "@models/index";
import { pusherServer } from "@lib/pusher";
import { Types } from "mongoose";

import dbConfig from "@utils/db";
import capitalizedRole from "@utils/capitalized-role";
import { errorHandler } from "@utils/error-handler";
import { STATUS_CODES } from "@utils/constants";
import { sendChatNotification } from "@lib/notifications/chat-notifications";

import { getSession } from "@lib/auth/get-session";

export async function GET(req: Request) {
  const session = await getSession();

  if (!session) {
    return errorHandler("Unauthorized", STATUS_CODES.BAD_REQUEST);
  }
  const { searchParams } = new URL(req.url);
  try {
    await dbConfig();

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
  const session = await getSession();

  if (!session) {
    return errorHandler("Unauthorized", STATUS_CODES.BAD_REQUEST);
  }
  try {
    const _id = new Types.ObjectId((session as any).user.id);

    await dbConfig();
    const { roomId, message, messageType, imageUrl } = await req.json();

    if (!roomId) {
      return errorHandler("Room ID is required", STATUS_CODES.BAD_REQUEST);
    }
    
    if (messageType === "image" && !imageUrl) {
      return errorHandler("Image URL is required for image messages", STATUS_CODES.BAD_REQUEST);
    }
    
    if (messageType === "text" && !message?.trim()) {
      return errorHandler("Message text is required for text messages", STATUS_CODES.BAD_REQUEST);
    }

    const messageData: any = {
      roomId: new Types.ObjectId(roomId),
      senderId: _id,
      senderRole: capitalizedRole((session as any).user.role),
      messageType: messageType || "text",
      message: message || "",
    };

    if (messageType === "image") {
      messageData.imageUrl = imageUrl;
    }

    const newMessage = await Message.create(messageData);

    // Populate sender info for real-time update
    await newMessage.populate("senderId", "firstname lastname profile");

    // Get room participants for notifications
    const room = await Room.findById(new Types.ObjectId(roomId));
    const recipient = room?.participants.find((p: any) => p.userId.toString() !== _id.toString());

    // update room's lastMessage and timestamp
    await Room.findByIdAndUpdate(new Types.ObjectId(roomId), {
      lastMessage: newMessage._id,
      updatedAt: new Date(),
    });

    // Trigger Pusher event with better error handling
    try {
      await pusherServer.trigger(`chat-${roomId}`, "new-message", {
        ...newMessage.toObject(),
        roomId: roomId, // Ensure roomId is included
      });
      console.log(`Message broadcasted to chat-${roomId}`);
    } catch (pusherError) {
      console.error("Failed to broadcast message via Pusher:", pusherError);
    }

    // Send notification to recipient
    if (recipient) {
      try {
        await sendChatNotification({
          recipientId: recipient.userId.toString(),
          senderName: (session as any).user.name,
          message: messageType === "image" ? "Sent an image" : (message || ""),
          messageType: messageType || "text",
        });
      } catch (notificationError) {
        console.error("Failed to send notification:", notificationError);
      }
    }

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    return errorHandler("Failed to send message", STATUS_CODES.SERVER_ERROR);
  }
}