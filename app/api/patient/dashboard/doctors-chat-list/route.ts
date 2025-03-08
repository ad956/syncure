import { NextResponse } from "next/server";
import dbConfig from "@utils/db";
import { errorHandler } from "@utils/error-handler";
import { STATUS_CODES } from "@utils/constants";
import { Patient } from "@models/index";
import { Types } from "mongoose";
import { auth } from "@lib/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return errorHandler("Unauthorized", STATUS_CODES.BAD_REQUEST);
    }

    const patient_id = new Types.ObjectId(session.user.id);
    await dbConfig();

    const patient = await Patient.findById(patient_id);
    if (!patient) {
      return errorHandler("Patient not found", STATUS_CODES.NOT_FOUND);
    }

    const MOCK_DOCTORS = [
      {
        id: 1,
        name: "Dr. Gojo Satoru",
        specialty: "Neurologist",
        avatar:
          "https://res.cloudinary.com/dtkfvp2ic/image/upload/v1716018319/gojo_lsohay.png",
        status: "offline",
        lastMessage: "We'll discuss your test results in our next appointment.",
        lastMessageTime: "Yesterday",
      },
      {
        id: 2,
        name: "Dr. Champaklal Jayantilal Gada",
        specialty: "Cardiologist",
        avatar:
          "https://res.cloudinary.com/dtkfvp2ic/image/upload/v1724345129/d5y905axqadctne2syz0.jpg",
        status: "online",
        lastMessage:
          "☕️🍪 Chai piyo, biscuit khao... chai piyo, biscuit kaho! ☕️🍪",
        lastMessageTime: "10:30 AM",
      },
      {
        id: 3,
        name: "Dr. Emma Thompson",
        specialty: "Dermatologist",
        avatar:
          "https://www.sketchappsources.com/resources/source-image/doctor-illustration-hamamzai.png",
        status: "online",
        lastMessage: "Remember to apply the prescribed cream twice daily.",
        lastMessageTime: "2:15 PM",
      },
      {
        id: 4,
        name: "Dr. Michael Chen",
        specialty: "Pediatrician",
        avatar:
          "https://images.apollo247.in/doctors/noimagefemale.png?tr=q-80,f-auto,w-100,dpr-2.5,c-at_max%20250w",
        status: "online",
        lastMessage: "The vaccination schedule looks good.",
        lastMessageTime: "11:45 AM",
      },
    ];

    return NextResponse.json(MOCK_DOCTORS, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching doctor's chat list:", error);
    return errorHandler(
      error.message || "Internal Server Error",
      STATUS_CODES.SERVER_ERROR
    );
  }
}
