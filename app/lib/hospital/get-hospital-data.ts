import { cache } from "react";
import { Types } from "mongoose";
import dbConfig from "@utils/db";
import Hospital from "@models/hospital";

const getHospitalData = cache(async (hospitalId: string | undefined) => {
  try {
    const hospital_id = new Types.ObjectId(hospitalId);

    await dbConfig();

    const hospitalData = await Hospital.findById(hospital_id);

    if (!hospitalData) {
      throw new Error("Hospital not found");
    }

    return JSON.parse(JSON.stringify(hospitalData));
  } catch (error) {
    console.error("An error occurred while fetching hospital data:", error);
    throw error;
  }
});

export default getHospitalData;
