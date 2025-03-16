import { Patient, MedicalHistory } from "@models/index";
import dbConfig from "@utils/db";
import { Types } from "mongoose";

export default async function getPatientMedicalHistory(
  patientId: string | undefined
) {
  try {
    const patient_id = new Types.ObjectId(patientId);
    await dbConfig();

    const patient = await Patient.findById(patient_id, { _id: 1 }).exec();
    if (!patient) {
      throw new Error("Patient not found");
    }

    const medicalHistory = await MedicalHistory.find(
      { patient: patient._id },
      {
        hospital: 1,
        doctor: 1,
        start_date: 1,
        end_date: 1,
        TreatmentStatus: 1,
        disease: 1,
      }
    )
      .populate("hospital", ["firstname", "lastname", "profile"])
      .populate("doctor", ["firstname", "lastname", "profile"])
      .exec();

    const formattedMedicalHistory = medicalHistory.map((history) => ({
      hospital: {
        name: `${history.hospital.firstname} ${history.hospital.lastname}`,
        profile: history.hospital.profile,
      },
      doctor: {
        name: `${history.doctor.firstname} ${history.doctor.lastname}`,
        profile: history.doctor.profile,
      },
      start_date: history.start_date,
      end_date: history.end_date,
      TreatmentStatus: history.TreatmentStatus,
      disease: history.disease,
    }));

    return JSON.parse(JSON.stringify(formattedMedicalHistory));
  } catch (error) {
    console.error("Error fetching patient medical history:", error);
    throw error;
  }
}
