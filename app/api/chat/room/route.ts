import { NextResponse } from "next/server";
import { Room, Message } from "@models/chat";
import { Patient, Doctor } from "@models/index";
import { Types } from "mongoose";

import dbConfig from "@utils/db";
import capitalizedRole from "@utils/capitalized-role";
import { errorHandler } from "@utils/error-handler";
import { STATUS_CODES } from "@utils/constants";

import { getSession } from "@lib/auth/get-session";

// get all rooms AKA chat-list
export async function GET(req: Request) {
  const session = await getSession();

  console.log("user is there ; " + session?.user.email);

  if (!session) {
    return errorHandler("Unauthorized", STATUS_CODES.BAD_REQUEST);
  }
  try {
    const _id = new Types.ObjectId(session.user.id);
    const role = capitalizedRole(session.user.role);

    await dbConfig();

    // find all rooms where the user is a participant
    const rooms = await Room.find({
      participants: {
        $elemMatch: { userId: _id, role },
      },
    })
      .populate({
        path: "lastMessage",
        select: "message messageType createdAt isRead",
      })
      .sort({ updatedAt: -1 });

    // Manually populate participant details
    const populatedRooms = await Promise.all(
      rooms.map(async (room) => {
        const roomObj = room.toObject();
        
        // Get participant details
        const participantDetails = await Promise.all(
          roomObj.participants.map(async (participant) => {
            let userDetails = null;
            
            if (participant.role === "Patient") {
              userDetails = await Patient.findById(participant.userId).select("firstname lastname profile");
            } else if (participant.role === "Doctor") {
              userDetails = await Doctor.findById(participant.userId).select("firstname lastname profile");
            }
            
            return {
              ...participant,
              userId: userDetails || participant.userId,
            };
          })
        );
        
        return {
          ...roomObj,
          participants: participantDetails,
        };
      })
    );

    return NextResponse.json(populatedRooms);
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
  const session = await getSession();

  console.log("user is there ; " + session?.user.email);

  if (!session) {
    return errorHandler("Unauthorized", STATUS_CODES.BAD_REQUEST);
  }
  try {
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

