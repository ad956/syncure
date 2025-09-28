import { cache } from "react";
import dbConfig from "@utils/db";
import { Types } from "mongoose";
import Admin from "@models/admin";

const getAdminData = cache(async (adminId: string | undefined) => {
  try {
    // Return null during build time when no adminId is provided
    if (!adminId) {
      return null;
    }

    const admin_id = new Types.ObjectId(adminId);
    await dbConfig();

    const adminData = await Admin.findById(admin_id);

    if (!adminData) {
      throw new Error("Admin not found");
    }
    return JSON.parse(JSON.stringify(adminData));
  } catch (error) {
    console.error("An error occurred while fetching admin data:", error);
    throw error;
  }
});

export default getAdminData;
