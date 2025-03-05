import { cache } from "react";
import { auth } from "../auth";
import dbConfig from "@utils/db";
import { Types } from "mongoose";
import { render } from "@react-email/render";
import { BookedAppointment, Patient } from "@models/index";
import sendEmail from "../emails/send-email";
import { AppointmentBookedTemplate } from "../emails/templates";
import sendNotification from "../novu";

const bookAppointment = cache(async (bookingData: BookingAppointmentType) => {
  try {
    const {
      state,
      city,
      hospital,
      disease,
      note,
      transaction_id,
      appointment_charge,
    } = bookingData;

    const session = await auth();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const patient_id = new Types.ObjectId(session.user.id);
    await dbConfig();

    const patient = await Patient.findById(patient_id);
    if (!patient) {
      throw new Error("Patient not found");
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
      throw new Error("Error saving appointment info");
    }

    const bookedAppointmentData = {
      state,
      city,
      hospital,
      disease,
      note,
      transaction_id,
      appointment_charge,
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
          appointment_charge,
        })
      ),
      from: {
        name: "Syncure",
        address: "support@patientfitnesstracker.com",
      },
    });

    // notifying patient
    await sendNotification(
      patient._id.toString(),
      "Your appointment request has been successfully received.",
      "appointment-request"
    );

    return JSON.parse(
      JSON.stringify({
        message: "Appointment request added successfully",
      })
    );
  } catch (error: any) {
    console.error("Error adding appointment request:", error);
    throw error;
  }
});

export default bookAppointment;
