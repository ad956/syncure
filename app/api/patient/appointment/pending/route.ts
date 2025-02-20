import { NextResponse } from "next/server";
import { Patient, BookedAppointment } from "@models/index";
import { dbConfig, errorHandler, STATUS_CODES } from "@utils/index";
import { Types } from "mongoose";
import { auth } from "@lib/auth";

export async function POST(req: Request) {
  try {
    const { hospital_id }: { hospital_id: string } = await req.json();

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

    // Checking if a pending appointment request exists with the hospital
    const alreadyBookedAppointment = await BookedAppointment.findOne({
      patient_id: patient._id,
      "hospital.id": new Types.ObjectId(hospital_id),
      approved: "pending",
    });

    if (alreadyBookedAppointment) {
      return NextResponse.json(
        { hasPendingAppointment: true },
        { status: 200 }
      );
    }

    return NextResponse.json({ hasPendingAppointment: false }, { status: 200 });
  } catch (error: any) {
    console.error("Error checking pending appointments:", error);
    return errorHandler(
      error.message || "Internal Server Error",
      STATUS_CODES.SERVER_ERROR
    );
  }
}
