import { NextResponse } from "next/server";
import { BookedAppointment, Patient } from "@models/index";
import { getSession } from "@lib/auth/get-session";
import { Types } from "mongoose";
import dbConfig from "@utils/db";
import { errorHandler } from "@utils/error-handler";
import { STATUS_CODES } from "@utils/constants";

export async function POST(req: Request) {
  const session = await getSession();

  if (!session) {
    return errorHandler("Unauthorized", STATUS_CODES.BAD_REQUEST);
  }
  const { email } = (session as any).user;

  try {
    console.log(email);

    await dbConfig();

    const patient = await Patient.findOne({ email });

    if (!patient) {
      return errorHandler("Patient not found", STATUS_CODES.NOT_FOUND);
    }

    const appointment = await BookedAppointment.findOne({
      patient_id: new Types.ObjectId(patient._id),
      approved: "pending",
    });

    if (appointment) {
      await BookedAppointment.updateOne(
        { _id: appointment._id },
        { $set: { approved: "approved" } }
      );
    }

    return NextResponse.json(
      { message: "Successfully scanned QR" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error scanning patient QR code:", error);
    return errorHandler("Internal Server Error", STATUS_CODES.SERVER_ERROR);
  }
}

