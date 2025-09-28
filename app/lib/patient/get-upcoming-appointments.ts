import { Patient, BookedAppointment, Doctor } from "@models/index";
import dbConfig from "@utils/db";
import { Types } from "mongoose";
import { getSession } from "../auth/get-session";

export default async function getUpcomingAppointments() {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const patient_id = new Types.ObjectId((session as any).user.id);
    await dbConfig();

    const patient = await Patient.findById(patient_id);
    if (!patient) {
      throw new Error("Patient not found");
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

    return JSON.parse(JSON.stringify(updatedAppointments));
  } catch (error) {
    console.error("Error fetching upcoming appointments:", error);
    throw error;
  }
}
