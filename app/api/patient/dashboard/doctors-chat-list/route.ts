import { NextRequest } from "next/server";
import dbConfig from "@utils/db";
import { Patient, Doctor } from "@models/index";
import BookedAppointment from "@models/booked-appointment";
import { Types } from "mongoose";
import { getSession } from "@lib/auth/get-session";
import { createSuccessResponse, createErrorResponse } from "@lib/api-response";

export async function GET(request: NextRequest) {
  try {
    await dbConfig();
    const session = await getSession();

    if (!session?.user?.id) {
      return createErrorResponse("Unauthorized access", 401);
    }

    const patientId = new Types.ObjectId((session as any).user.id);
    
    const patient = await Patient.findById(patientId).lean();
    if (!patient) {
      return createErrorResponse("Patient not found", 404);
    }

    // Fetch only doctors assigned to patient's approved appointments
    const assignedDoctorIds = await BookedAppointment.find({
      patient_id: patientId,
      approved: 'approved',
      assigned_doctor: { $exists: true }
    }).distinct('assigned_doctor');

    if (assignedDoctorIds.length === 0) {
      return createSuccessResponse([], "No assigned doctors found. Complete an appointment first.");
    }

    const doctors = await Doctor.find({
      _id: { $in: assignedDoctorIds },
      is_active: true
    })
      .select('firstname lastname profile specialty hospital')
      .lean();

    const formattedDoctors = doctors.map(doctor => ({
      _id: doctor._id,
      firstname: doctor.firstname,
      lastname: doctor.lastname,
      profile: doctor.profile,
      specialty: doctor.specialty,
      hospital: doctor.hospital
    }));

    return createSuccessResponse(formattedDoctors);
  } catch (error: any) {
    console.error("Error fetching doctors list:", error);
    return createErrorResponse(
      "Failed to fetch doctors list", 
      500, 
      process.env.NODE_ENV === 'development' ? error.message : undefined
    );
  }
}

