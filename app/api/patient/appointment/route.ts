import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { render } from "@react-email/render";
import { AppointmentBookedTemplate, sendEmail } from "@lib/emails";
import sendNotification from "@lib/novu";
import { Patient, BookedAppointment, Doctor } from "@models/index";
import { auth } from "@lib/auth";
import dbConfig from "@utils/db";
import { errorHandler } from "@utils/error-handler";
import { STATUS_CODES } from "@utils/constants";

// getting patient's approved appointments
export async function GET() {
  const session = await auth();

  if (!session) {
    return errorHandler("Unauthorized", STATUS_CODES.BAD_REQUEST);
  }
  try {
    const patient_id = new Types.ObjectId(session.user.id);
    await dbConfig();

    const patient = await Patient.findById(patient_id);
    if (!patient) {
      return errorHandler("Patient not found", STATUS_CODES.NOT_FOUND);
    }

    const appointments = await BookedAppointment.find({
      patient_id: patient._id,
      approved: "approved",
    });

    const doctorIds = appointments.map((appointment) => appointment.doctor_id);
    const doctors = await Doctor.find(
      { _id: { $in: doctorIds } },
      { firstname: 1, lastname: 1, specialty: 1, profile: 1 }
    );

    const updatedAppointments = appointments.map((appointment) => {
      const appointmentObj = appointment.toObject();
      const doctor = doctors.find(
        (doc) => doc._id.toString() === appointmentObj.doctor_id.toString()
      );

      if (doctor) {
        appointmentObj.doctor = {
          name: `${doctor.firstname} ${doctor.lastname}`,
          profile: doctor.profile,
          specialty: doctor.specialty,
        };
      }
      return appointmentObj;
    });

    return NextResponse.json(updatedAppointments, { status: 200 });
  } catch (error: any) {
    console.error("Error getting appointments:", error);
    return errorHandler(
      error.message || "Internal Server Error",
      STATUS_CODES.SERVER_ERROR
    );
  }
}

// booking an appointment
export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return errorHandler("Unauthorized", STATUS_CODES.BAD_REQUEST);
  }
  const data: BookingAppointmentType = await req.json();

  try {
    const { state, city, hospital, disease, note, transaction_id } = data;

    const patient_id = new Types.ObjectId(session.user.id);
    await dbConfig();

    const patient = await Patient.findById(patient_id);
    if (!patient) {
      return errorHandler("Patient not found", STATUS_CODES.NOT_FOUND);
    }

    const appointmentData = {
      state,
      city,
      hospital: {
        id: new Types.ObjectId(hospital.hospital_id),
        name: hospital.hospital_name,
      },
      disease,
      note,
      approved: "pending",
      patient_id: patient._id,
      doctor_id: null,
      receptionist_id: null,
    };

    const res = await BookedAppointment.create(appointmentData);
    if (!res) {
      return errorHandler(
        "Error saving appointment info",
        STATUS_CODES.SERVER_ERROR
      );
    }

    const bookedAppointmentData = {
      state,
      city,
      hospital,
      disease,
      note,
      transaction_id,
    };

    // sending email to patient confirming request
    await sendEmail({
      to: patient.email || "yourmail@example.com",
      subject: `Your Appointment Request Has Been Received`,
      html: render(
        AppointmentBookedTemplate({
          name: `${patient.firstname} ${patient.lastname}`,
          email: patient.email,
          bookedAppointmentData,
          transaction_id,
        })
      ),
      from: {
        name: "Syncure",
        address: "support@syncure.com",
      },
    });

    // notifying patient
    await sendNotification(
      patient._id.toString(),
      "Your appointment request has been successfully received.",
      "appointment-request"
    );

    return NextResponse.json(
      { message: "Appointment request added successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error adding appointment request:", error);
    return errorHandler(
      error.message || "Internal Server Error",
      STATUS_CODES.SERVER_ERROR
    );
  }
}
