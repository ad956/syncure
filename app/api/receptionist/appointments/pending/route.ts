import { NextResponse } from "next/server";
import { Patient, BookedAppointment, Receptionist } from "@models/index";
import { Types } from "mongoose";
import { auth } from "@lib/auth";
import { dbConfig, errorHandler, STATUS_CODES } from "@utils/index";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return errorHandler("Unauthorized", STATUS_CODES.BAD_REQUEST);
    }

    const receptionist_id = new Types.ObjectId(session.user.id);

    await dbConfig();

    const currentHospitalResult = await Receptionist.findById(receptionist_id, {
      current_hospital: 1,
    });

    if (!currentHospitalResult) {
      return errorHandler(
        "Receptionist hospital isn't selected",
        STATUS_CODES.NOT_FOUND
      );
    }

    const currentHospitalId = currentHospitalResult.current_hospital;

    const pendingAppointments = await BookedAppointment.find({
      approved: "pending",
      "hospital.id": currentHospitalId,
    });

    if (pendingAppointments.length === 0) {
      return NextResponse.json({ patientDetails: [] }, { status: 200 });
    }

    const patientIds = pendingAppointments.map(
      (appointment) => appointment.patient_id
    );

    const patientDetails = await Patient.find(
      { _id: { $in: patientIds } },
      {
        firstname: 1,
        lastname: 1,
        email: 1,
        dob: 1,
        gender: 1,
        contact: 1,
        profile: 1,
        address: 1,
      }
    );

    const patientDetailsWithAdditionalInfo = patientDetails.map((patient) => {
      const appointment = pendingAppointments.find(
        (appointment) =>
          appointment.patient_id.toString() === patient._id.toString()
      );
      if (appointment) {
        return {
          ...patient.toObject(),
          disease: appointment.disease,
          note: appointment.note,
          date: appointment.date,
          timing: appointment.timing,
        };
      }
      return patient.toObject();
    });

    return NextResponse.json(
      { patientDetails: patientDetailsWithAdditionalInfo },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching pending patient appointments:", error);
    return errorHandler("Internal Server Error", STATUS_CODES.SERVER_ERROR);
  }
}
