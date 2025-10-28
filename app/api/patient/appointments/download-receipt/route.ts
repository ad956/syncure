import { NextRequest, NextResponse } from "next/server";
import BookedAppointment from "@models/booked-appointment";
import { getSession } from "@lib/auth/get-session";
import { createErrorResponse } from "@lib/api-response";
import dbConfig from "@utils/db";



export async function GET(request: NextRequest) {
  try {
    await dbConfig();
    const session = await getSession();

    if (!session?.user?.id) {
      return createErrorResponse("Unauthorized access", 401);
    }

    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get('appointmentId');

    if (!appointmentId) {
      return createErrorResponse("Appointment ID is required", 400);
    }

    const appointment = await BookedAppointment.findOne({
      _id: appointmentId,
      patient_id: (session as any).user.id
    });

    if (!appointment) {
      return createErrorResponse("Appointment not found", 404);
    }

    if (!appointment.bill_receipt_url) {
      return createErrorResponse("Receipt not available", 404);
    }

    // Redirect to Cloudinary URL for download
    return NextResponse.redirect(appointment.bill_receipt_url);

  } catch (error: any) {
    console.error("Error downloading receipt:", error);
    return createErrorResponse("Failed to download receipt", 500);
  }
}