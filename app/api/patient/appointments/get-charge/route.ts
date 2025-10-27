import { NextRequest } from "next/server";
import CityStateHospital from "@models/city-state-hospitals";
import dbConfig from "@utils/db";
import { createSuccessResponse, createErrorResponse } from "@lib/api-response";

export async function GET(request: NextRequest) {
  try {
    await dbConfig();
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const city = searchParams.get('city');
    const hospitalName = searchParams.get('hospitalName');

    if (!state || !city || !hospitalName) {
      return createErrorResponse("Missing required parameters", 400);
    }

    const hospitalDoc = await CityStateHospital.findById(state).lean();
    if (!hospitalDoc) {
      return createErrorResponse("State not found", 404);
    }

    const stateKey = Object.keys(hospitalDoc).find(key => key !== '_id' && key !== '__v');
    const hospitals = stateKey ? (hospitalDoc as any)[stateKey]?.[city] || [] : [];
    const hospital = hospitals.find((h: any) => h.hospital_name === hospitalName);

    if (!hospital) {
      return createErrorResponse("Hospital not found", 404);
    }

    return createSuccessResponse({
      appointmentCharge: hospital.appointment_charge,
      hospitalName: hospital.hospital_name
    });

  } catch (error: any) {
    console.error("Error fetching appointment charge:", error);
    return createErrorResponse("Failed to fetch appointment charge", 500);
  }
}