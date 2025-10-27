import { NextRequest } from 'next/server';
import VitalSigns from "@models/vital-signs";
import dbConfig from "@utils/db";
import { getSession } from "@lib/auth/get-session";
import { createSuccessResponse, createErrorResponse } from "@lib/api-response";

export async function GET(request: NextRequest) {
  try {
    await dbConfig();
    const session = await getSession();
    
    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '30';
    const today = searchParams.get('today');
    
    let query: any = { patient_id: (session as any).user.id };
    
    // If requesting today's vitals only
    if (today === 'true') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      query = {
        ...query,
        recorded_at: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      };
    }

    const vitals = await VitalSigns
      .find(query)
      .sort({ recorded_at: -1 })
      .limit(parseInt(limit));

    return createSuccessResponse({
      vitals,
      count: vitals.length
    });
  } catch (error) {
    console.error('Error fetching vital signs:', error);
    return createErrorResponse('Failed to fetch vital signs', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConfig();
    const session = await getSession();
    
    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { weight, systolicBP, diastolicBP, heartRate, temperature, bloodSugar, notes } = body;

    const newVitalSigns = new VitalSigns({
      patient_id: (session as any).user.id,
      weight: weight ? parseFloat(weight) : undefined,
      systolic_bp: systolicBP ? parseInt(systolicBP) : undefined,
      diastolic_bp: diastolicBP ? parseInt(diastolicBP) : undefined,
      heart_rate: heartRate ? parseInt(heartRate) : undefined,
      temperature: temperature ? parseFloat(temperature) : undefined,
      blood_sugar: bloodSugar ? parseInt(bloodSugar) : undefined,
      notes,
    });

    await newVitalSigns.save();

    return createSuccessResponse({ vitalSigns: newVitalSigns }, 'Vital signs recorded successfully');
  } catch (error) {
    console.error('Error saving vital signs:', error);
    return createErrorResponse('Failed to record vital signs', 500);
  }
}