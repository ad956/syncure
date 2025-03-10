import dbConfig from "@utils/db";
import { Types } from "mongoose";
import HospitalDetails from "@models/hospital_details";
import { cache } from "react";
import { auth } from "../auth";

const getHospitalDetails = cache(async () => {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const hospital_id = new Types.ObjectId(session.user.id);

    await dbConfig();

    const hospitalDetailsData = await HospitalDetails.findOne({
      hospitalId: hospital_id,
    });

    if (!hospitalDetailsData) {
      throw new Error("Hospital details not found");
    }
    return JSON.parse(JSON.stringify(hospitalDetailsData));
  } catch (error) {
    console.error(
      "An error occurred while fetching hospital additional details:",
      error
    );
    throw error;
  }
});

export default getHospitalDetails;
