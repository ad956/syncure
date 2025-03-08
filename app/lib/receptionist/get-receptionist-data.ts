import Receptionist from "@models/receptionist";
import { cache } from "react";
import { auth } from "../auth";
import { Types } from "mongoose";
import dbConfig from "@utils/db";

const getReceptionistData = cache(async () => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }
    const receptionist_id = new Types.ObjectId(session.user.id);

    await dbConfig();

    const projection = {
      role: 0,
      otp: 0,
      password: 0,
      current_hospital: 0,
    };

    const receptionistData = await Receptionist.findById(
      receptionist_id,
      projection
    );

    if (!receptionistData) {
      throw new Error("Receptionist not found");
    }
    return JSON.parse(JSON.stringify(receptionistData));
  } catch (error) {
    console.error("Error in getReceptionistData:", error);
    throw error;
  }
});

export default getReceptionistData;
