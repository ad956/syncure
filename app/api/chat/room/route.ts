import { NextResponse } from "next/server";
import dbConfig from "@utils/db";
import { Room } from "@models/chat";
import { Types } from "mongoose";
import { capitalizedRole, errorHandler, STATUS_CODES } from "@utils/index";
import { auth } from "@lib/auth";

// get all rooms AKA chat-list
export async function GET(req: Request) {
  try {
    const session = await auth();

    console.log("user is there ; " + session?.user.email);

    if (!session) {
      return errorHandler("Unauthorized", STATUS_CODES.BAD_REQUEST);
    }

    const _id = new Types.ObjectId(session.user.id);
    const role = capitalizedRole(session.user.role);

    await dbConfig();

    // find all rooms where the user is a participant
    const rooms = await Room.find({
      participants: {
        $elemMatch: { userId: _id, role },
      },
    })
      .populate([
        {
          path: "participants.userId",
          match: { role: { $ne: role } }, // get the other participant's info
          select: "firstname lastname profile",
        },
        {
          path: "lastMessage",
          select: "message createdAt isRead",
        },
      ])
      .sort({ updatedAt: -1 });

    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    return errorHandler(
      "Failed to fetch chat rooms",
      STATUS_CODES.SERVER_ERROR
    );
  }
}

// create a room AKA chat
export async function POST(req: Request) {
  try {
    const session = await auth();

    console.log("user is there ; " + session?.user.email);

    if (!session) {
      return errorHandler("Unauthorized", STATUS_CODES.BAD_REQUEST);
    }

    const senderId = new Types.ObjectId(session.user.id); // Sender (logged-in user) ID
    const role = session.user.role;
    await dbConfig();

    const { receiverId } = await req.json();

    if (!receiverId) {
      return errorHandler("Receiver ID is required", STATUS_CODES.BAD_REQUEST);
    }

    const receiverObjectId = new Types.ObjectId(receiverId);

    const senderRole = role === "patient" ? "Patient" : "Doctor";
    const receiverRole = role === "patient" ? "Doctor" : "Patient";

    // check if room already exists
    const existingRoom = await Room.findOne({
      participants: {
        $all: [
          {
            $elemMatch: {
              userId: senderId,
              role: senderRole,
            },
          },
          {
            $elemMatch: {
              userId: receiverObjectId,
              role: receiverRole,
            },
          },
        ],
      },
    });

    if (existingRoom) {
      return NextResponse.json(existingRoom);
    }

    // create new room
    const room = await Room.create({
      participants: [
        { userId: senderId, role: senderRole },
        { userId: receiverObjectId, role: receiverRole },
      ],
    });

    return NextResponse.json(room);
  } catch (error) {
    console.error("Error creating chat room:", error);
    return errorHandler(
      "Failed to create chat room",
      STATUS_CODES.SERVER_ERROR
    );
  }
}
