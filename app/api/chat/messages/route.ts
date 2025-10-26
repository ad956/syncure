import { NextRequest, NextResponse } from "next/server";
import { Patient, Doctor, Message, Room } from "@models/index";
import { pusherServer } from "@lib/pusher";
import { Types } from "mongoose";
import dbConfig from "@utils/db";
import capitalizedRole from "@utils/capitalized-role";
import { sendChatNotification } from "@lib/notifications/chat-notifications";
import { getSession } from "@lib/auth/get-session";
import { createSuccessResponse, createErrorResponse, createValidationErrorResponse } from "@lib/api-response";
import { sendMessageSchema, getMessagesSchema } from "@lib/validations/chat";

export async function GET(request: NextRequest) {
  try {
    await dbConfig();
    const session = await getSession();

    if (!session?.user?.id) {
      return createErrorResponse("Unauthorized access", 401);
    }

    const { searchParams } = new URL(request.url);
    const queryParams = {
      roomId: searchParams.get("roomId"),
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    };

    const validation = getMessagesSchema.safeParse(queryParams);
    if (!validation.success) {
      return createValidationErrorResponse(validation.error.errors);
    }

    const { roomId, page, limit } = validation.data;

    const room = await Room.findOne({
      _id: new Types.ObjectId(roomId),
      "participants.userId": new Types.ObjectId((session as any).user.id)
    });

    if (!room) {
      return createErrorResponse("Room not found or access denied", 404);
    }

    const messages = await Message.find({ roomId: new Types.ObjectId(roomId) })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("senderId", "firstname lastname profile")
      .sort({ createdAt: 1 })
      .lean();

    return createSuccessResponse({
      messages,
      pagination: {
        page,
        limit,
        hasMore: messages.length === limit
      }
    });
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    return createErrorResponse(
      "Failed to fetch messages", 
      500, 
      process.env.NODE_ENV === 'development' ? error.message : undefined
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConfig();
    const session = await getSession();

    if (!session?.user?.id) {
      return createErrorResponse("Unauthorized access", 401);
    }

    const body = await request.json();
    const validation = sendMessageSchema.safeParse(body);
    
    if (!validation.success) {
      return createValidationErrorResponse(validation.error.errors);
    }

    const { roomId, message, messageType, imageUrl } = validation.data;
    const userId = new Types.ObjectId((session as any).user.id);

    const room = await Room.findOne({
      _id: new Types.ObjectId(roomId),
      "participants.userId": userId
    });

    if (!room) {
      return createErrorResponse("Room not found or access denied", 404);
    }

    const messageData = {
      roomId: new Types.ObjectId(roomId),
      senderId: userId,
      senderRole: capitalizedRole((session as any).user.role),
      messageType,
      message,
      ...(messageType === "image" && { imageUrl }),
    };

    const newMessage = await Message.create(messageData);
    await newMessage.populate("senderId", "firstname lastname profile");

    await Room.findByIdAndUpdate(new Types.ObjectId(roomId), {
      lastMessage: newMessage._id,
      updatedAt: new Date(),
    });

    const recipient = room.participants.find((p: any) => 
      p.userId.toString() !== userId.toString()
    );

    try {
      await pusherServer.trigger(`chat-${roomId}`, "new-message", {
        ...newMessage.toObject(),
        roomId,
      });
    } catch (pusherError) {
      console.error("Pusher broadcast failed:", pusherError);
    }

    if (recipient) {
      try {
        await sendChatNotification({
          recipientId: recipient.userId.toString(),
          senderName: (session as any).user.name,
          message: messageType === "image" ? "Sent an image" : message,
          messageType,
        });
      } catch (notificationError) {
        console.error("Notification failed:", notificationError);
      }
    }

    return createSuccessResponse(newMessage, "Message sent successfully");
  } catch (error: any) {
    console.error("Error sending message:", error);
    return createErrorResponse(
      "Failed to send message", 
      500, 
      process.env.NODE_ENV === 'development' ? error.message : undefined
    );
  }
}