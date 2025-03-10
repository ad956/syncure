import { cache } from "react";
import dbConfig from "@utils/db";
import { Types } from "mongoose";
import Admin from "@models/admin";
import { auth } from "../auth";

const getAdminData = cache(async () => {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const admin_id = new Types.ObjectId(session.user.id);
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
