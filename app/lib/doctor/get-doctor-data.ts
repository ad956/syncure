import { cache } from "react";
import Doctor from "@models/doctor";
import dbConfig from "@utils/db";
import { Types } from "mongoose";

const getDoctorData = cache(async (doctorId: string | undefined) => {
  try {
    const doctor_id = new Types.ObjectId(doctorId);

    await dbConfig();

    const doctorData = await Doctor.findById(doctor_id);

    if (!doctorData) {
      throw new Error("Doctor not found");
    }

    return JSON.parse(JSON.stringify(doctorData));
  } catch (error) {
    console.error("An error occurred while fetching doctor data:", error);
    throw error;
  }
});

export default getDoctorData;
