import { cache } from "react";
import Patient from "@models/patient";
import dbConfig from "@utils/db";
import { Types } from "mongoose";

const getPatientData = cache(async (userId: string | undefined) => {
  try {
    const patient_id = new Types.ObjectId(userId);
    await dbConfig();
    const projection = {
      role: 0,
      otp: 0,
      password: 0,
      current_hospital: 0,
    };
    const patientData = await Patient.findById(patient_id, projection);
    if (!patientData) {
      throw new Error("Patient not found");
    }
    return JSON.parse(JSON.stringify(patientData));
  } catch (error) {
    console.error("Error in getPatientData:", error);
    throw error;
  }
});

export default getPatientData;
