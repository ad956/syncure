import { cache } from "react";
import { Types } from "mongoose";
import dbConfig from "@utils/db";
import Hospital from "@models/hospital";
import { auth } from "../auth";

const getHospitalData = cache(async () => {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const hospital_id = new Types.ObjectId(session.user.id);

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
