import { cache } from "react";
import { BookedAppointment, Patient, Receptionist } from "@models/index";
import dbConfig from "@utils/db";
import { Types } from "mongoose";

const getPendingAppointments = cache(
  async (receptionistId: string | undefined) => {
    try {
      const receptionist_id = new Types.ObjectId(receptionistId);

      await dbConfig();

      const currentHospitalResult = await Receptionist.findById(
        receptionist_id,
        {
          current_hospital: 1,
        }
      );

      if (!currentHospitalResult) {
        throw new Error("Receptionist hospital isn't selected");
      }

      const currentHospitalId = currentHospitalResult.current_hospital;

      const pendingAppointments = await BookedAppointment.find({
        approved: "pending",
        "hospital.id": currentHospitalId,
      });

      if (pendingAppointments.length === 0) {
        return JSON.parse(JSON.stringify({ patientDetails: [] }));
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

      return JSON.parse(
        JSON.stringify({ patientDetails: patientDetailsWithAdditionalInfo })
      );
    } catch (error) {
      console.error("Error fetching pending appointments:", error);
      throw error;
    }
  }
);

export default getPendingAppointments;
