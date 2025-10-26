import { NextResponse } from "next/server";
import BookedAppointment from "@models/booked-appointment";
import { Types } from "mongoose";
import dbConfig from "@utils/db";
import { getSession } from "@lib/auth/get-session";
import { createSuccessResponse, createErrorResponse } from "@lib/api-response";
import type { Session } from "@lib/types/session";

export async function GET() {
  console.log("API called at:", new Date().toISOString());
  try {
    await dbConfig();
    const session = await getSession() as Session | null;

    if (!session?.user?.id) {
      return createErrorResponse("Unauthorized access", 401);
    }

    const patientId = new Types.ObjectId(session.user.id);
    console.log("Appointments API - Patient ID:", patientId.toString());

    const appointments = await BookedAppointment.find({
      patient_id: patientId,
      approved: "approved",
    })
      .sort({ date: 1 })
      .limit(10)
      .lean();

    console.log("Appointments found:", appointments.length);
    console.log(
      "Raw appointments from DB:",
      appointments.map((apt) => ({
        _id: apt._id,
        createdAt: apt.createdAt,
        disease: apt.disease,
        approved: apt.approved,
      }))
    );

    const formattedAppointments = appointments.map((apt: any) => ({
      _id: apt._id,
      date: apt.date || apt.createdAt,
      disease: apt.disease,
      note: apt.note,
      createdAt: apt.createdAt,
      timing: apt.timing || {
        startTime: "10:00 AM",
        endTime: "11:00 AM",
      },
      city: apt.city || "Mumbai",
      state: apt.state || "Maharashtra",
      hospital: {
        id: apt.hospital?.id,
        name: apt.hospital?.name || "General Hospital",
      },
      doctor: {
        name: "Dr. John Smith",
        specialty: "General Medicine",
        profile: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
      },
      booked_for: apt.booked_for || { type: 'self' },
      approved: apt.approved,
    }));

    console.log(
      "Formatted appointments being returned:",
      formattedAppointments.map((apt) => ({
        _id: apt._id,
        date: apt.date,
        createdAt: apt.createdAt,
        disease: apt.disease,
      }))
    );

    const response = createSuccessResponse({
      appointments: formattedAppointments,
      count: formattedAppointments.length,
    });
    
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    return response;
  } catch (error: any) {
    console.error("Error fetching upcoming appointments:", error);
    return createErrorResponse(
      "Failed to fetch appointments", 
      500, 
      process.env.NODE_ENV === 'development' ? error.message : undefined
    );
  }
}
