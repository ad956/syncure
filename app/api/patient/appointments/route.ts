import { NextRequest } from "next/server";
import BookedAppointment from "@models/booked-appointment";
import CityStateHospital from "@models/city-state-hospitals";
import Hospital from "@models/hospital";
import { Types } from "mongoose";
import dbConfig from "@utils/db";
import { getSession } from "@lib/auth/get-session";
import { createSuccessResponse, createErrorResponse } from "@lib/api-response";



export async function GET(request: NextRequest) {
  try {
    await dbConfig();
    const session = await getSession();

    if (!session?.user?.id) {
      return createErrorResponse("Unauthorized access", 401);
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const limit = parseInt(searchParams.get('limit') || '10');

    const patientId = new Types.ObjectId((session as any).user.id);
    
    let query: any = { patient_id: patientId };
    if (status !== 'all') {
      query.approved = status;
    }

    const appointments = await BookedAppointment.find(query)
      .populate('assigned_doctor', 'firstname lastname profile specialty')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Get state names and hospital profiles
    const stateIds = Array.from(new Set(appointments.map((apt: any) => apt.state).filter(Boolean)));
    const stateData = await CityStateHospital.find({ _id: { $in: stateIds } }).lean();
    
    // Get hospital profiles using hospital.id (which is the hospital_id from citystate collection)
    const hospitalIds = Array.from(new Set(appointments.map((apt: any) => apt.hospital?.id).filter(Boolean)));
    const validHospitalIds = hospitalIds.filter(id => Types.ObjectId.isValid(id)).map(id => new Types.ObjectId(id));
    const hospitalProfiles = await Hospital.find({ _id: { $in: validHospitalIds } }, { profile: 1 }).lean();
    
    const formattedAppointments = appointments.map((apt: any) => {
      const state = stateData.find((s: any) => s._id.toString() === apt.state);
      const stateName = state ? Object.keys(state).find(key => key !== '_id' && key !== '__v') : apt.state;
      
      const hospitalProfile = hospitalProfiles.find((h: any) => h._id.toString() === apt.hospital?.id?.toString());
      
      return {
        _id: apt._id,
        date: apt.date,
        disease: apt.disease,
        hospital: {
          ...apt.hospital,
          profile: hospitalProfile?.profile || null
        },
        approved: apt.approved,
        appointment_status: apt.appointment_status,
        assigned_doctor: apt.assigned_doctor,
        timing: apt.timing,
        note: apt.note,
        booked_for: apt.booked_for,
        state: stateName || apt.state,
        city: apt.city,
        createdAt: apt.createdAt
      };
    });

    return createSuccessResponse({
      appointments: formattedAppointments,
      count: formattedAppointments.length
    });

  } catch (error: any) {
    console.error("Error fetching appointments:", error);
    return createErrorResponse("Failed to fetch appointments", 500);
  }
}