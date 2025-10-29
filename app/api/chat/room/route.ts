import { NextRequest } from "next/server";
import { Room, Message } from "@models/chat";
import { Patient, Doctor } from "@models/index";
import { Types } from "mongoose";
import dbConfig from "@utils/db";
import capitalizedRole from "@utils/capitalized-role";
import { getSession } from "@lib/auth/get-session";
import { createSuccessResponse, createErrorResponse, createValidationErrorResponse } from "@lib/api-response";
import { createRoomSchema } from "@lib/validations/chat";

export async function GET(request: NextRequest) {
  try {
    await dbConfig();
    const session = await getSession();

    if (!session?.user?.id) {
      return createErrorResponse("Unauthorized access", 401);
    }

    const userId = new Types.ObjectId((session as any).user.id);
    const role = capitalizedRole((session as any).user.role);

    const rooms = await Room.find({
      participants: {
        $elemMatch: { userId, role },
      },
    })
      .populate({
        path: "lastMessage",
        select: "message messageType createdAt isRead",
      })
      .sort({ updatedAt: -1 })
      .lean();

    const populatedRooms = await Promise.all(
      rooms.map(async (room: any) => {
        const participantDetails = await Promise.all(
          room.participants.map(async (participant: any) => {
            let userDetails = null;
            
            if (participant.role === "Patient") {
              userDetails = await Patient.findById(participant.userId)
                .select("firstname lastname profile")
                .lean();
            } else if (participant.role === "Doctor") {
              userDetails = await Doctor.findById(participant.userId)
                .select("firstname lastname profile specialty")
                .lean();
            }
            
            return {
              ...participant,
              userId: userDetails || participant.userId,
            };
          })
        );
        
        return {
          ...room,
          participants: participantDetails,
        };
      })
    );

    return createSuccessResponse(populatedRooms);
  } catch (error: any) {
    console.error("Error fetching chat rooms:", error);
    return createErrorResponse("Failed to fetch chat rooms", 500);
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
    const validation = createRoomSchema.safeParse({
      participantId: body.receiverId
    });
    
    if (!validation.success) {
      return createValidationErrorResponse(validation.error.errors);
    }

    const { participantId } = validation.data;
    const senderId = new Types.ObjectId((session as any).user.id);
    const senderRole = capitalizedRole((session as any).user.role);
    const receiverObjectId = new Types.ObjectId(participantId);

    // Ensure only Patient-Doctor pairing
    if (senderRole !== 'Patient') {
      return createErrorResponse("Only patients can initiate chats with doctors", 403);
    }

    // Verify the receiver is actually a doctor
    const doctor = await Doctor.findById(receiverObjectId).select('_id').lean();
    if (!doctor) {
      return createErrorResponse("Invalid doctor ID", 404);
    }

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
              role: 'Doctor',
            },
          },
        ],
      },
    }).lean();

    if (existingRoom) {
      return createSuccessResponse(existingRoom);
    }

    const room = await Room.create({
      participants: [
        { userId: senderId, role: 'Patient' },
        { userId: receiverObjectId, role: 'Doctor' },
      ],
    });

    return createSuccessResponse(room);
  } catch (error: any) {
    console.error("Error creating chat room:", error);
    return createErrorResponse("Failed to create chat room", 500);
  }
}

