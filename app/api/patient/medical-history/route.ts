import { Patient, MedicalHistory } from "@models/index";
import { Types } from "mongoose";
import dbConfig from "@utils/db";
import { getSession } from "@lib/auth/get-session";
import { medicalHistoryResponseSchema } from "@lib/validations/patient";
import { createSuccessResponse, createErrorResponse, createValidationErrorResponse } from "@lib/api-response";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return createErrorResponse("Unauthorized", 401);
    }

    const patient_id = new Types.ObjectId(session.user.id);
    await dbConfig();

    const patient = await Patient.findById(patient_id, { _id: 1 }).exec();
    if (!patient) {
      return createErrorResponse("Patient not found", 404);
    }

    const medicalHistory = await MedicalHistory.find(
      { patient: patient._id },
      {
        hospital: 1,
        doctor: 1,
        start_date: 1,
        end_date: 1,
        TreatmentStatus: 1,
        disease: 1,
      }
    )
      .populate("hospital", ["firstname", "lastname", "profile"])
      .populate("doctor", ["firstname", "lastname", "profile"])
      .exec();

    const formattedMedicalHistory = medicalHistory.map((history) => ({
      _id: history._id.toString(),
      hospital: {
        name: `${history.hospital.firstname} ${history.hospital.lastname}`,
        profile: history.hospital.profile,
      },
      doctor: {
        name: `${history.doctor.firstname} ${history.doctor.lastname}`,
        profile: history.doctor.profile,
      },
      start_date: history.start_date,
      end_date: history.end_date,
      TreatmentStatus: history.TreatmentStatus,
      disease: history.disease,
    }));

    // Validate response data
    const validation = medicalHistoryResponseSchema.safeParse(formattedMedicalHistory);
    if (!validation.success) {
      return createValidationErrorResponse(validation.error.errors);
    }

    return createSuccessResponse(validation.data);
  } catch (error: any) {
    console.error("Error fetching medical history:", { error: error.message });
    return createErrorResponse("Failed to fetch medical history", 500);
  }
}

