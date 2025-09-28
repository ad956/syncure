import Receptionist from "@models/receptionist";
import { cache } from "react";
import { Types } from "mongoose";
import dbConfig from "@utils/db";

const getReceptionistData = cache(
  async (receptionistId: string | undefined) => {
    try {
      // Return null during build time when no receptionistId is provided
      if (!receptionistId) {
        return null;
      }

      const receptionist_id = new Types.ObjectId(receptionistId);

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
  }
);

export default getReceptionistData;
