import Patient from "@models/patient";
import dbConfig from "@utils/db";
import { Types } from "mongoose";
import { auth } from "../auth";

export default async function getLabResults() {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const patient_id = new Types.ObjectId(session.user.id);
    await dbConfig();

    const patient = await Patient.findById(patient_id);
    if (!patient) {
      throw new Error("Patient not found");
    }

    const labResults = [
      {
        id: "LR-001",
        test: "Complete Blood Count",
        date: "2024-10-14",
        status: "Completed",
        result: "Normal",
      },
      {
        id: "LR-002",
        test: "Lipid Profile",
        date: "2024-10-15",
        status: "Pending",
        result: "Awaiting",
      },
      {
        id: "LR-003",
        test: "Thyroid Function",
        date: "2024-10-16",
        status: "Processing",
        result: "In Progress",
      },
    ];

    return JSON.parse(JSON.stringify(labResults));
  } catch (error) {
    console.error(
      "An error occurred while fetching lab results for patient : ",
      error
    );
    throw error;
  }
}
