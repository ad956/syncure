import { NextRequest, NextResponse } from 'next/server';
import MedicationLog from "@models/medication-log";
import Patient from "@models/patient";
import { Types } from 'mongoose';
import dbConfig from "@utils/db";
import { getSession } from "@lib/auth/get-session";
import { createSuccessResponse, createErrorResponse } from "@lib/api-response";

export async function GET(request: NextRequest) {
  try {
    await dbConfig();
    const session = await getSession();
    
    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized access', 401);
    }

    const patientId = new Types.ObjectId((session as any).user.id);
    const medications = await MedicationLog
      .find({ 
        patient_id: patientId,
        is_active: true 
      })
      .sort({ createdAt: -1 });

    return createSuccessResponse({ medications, count: medications.length });
  } catch (error: any) {
    console.error('Error fetching medications:', { error: error.message });
    return createErrorResponse('Failed to fetch medications', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConfig();
    const session = await getSession();
    
    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized access', 401);
    }

    const body = await request.json();
    const { medication_name, dosage, frequency, instructions, prescribed_by, end_date } = body;

    const newMedication = new MedicationLog({
      patient_id: (session as any).user.id,
      medication_name,
      dosage,
      frequency,
      instructions,
      prescribed_by,
      end_date,
      start_date: new Date(),
      is_active: true,
    });

    await newMedication.save();

    // Update patient's active medications count
    await Patient.findByIdAndUpdate((session as any).user.id, {
      $inc: { activeMedications: 1 }
    });

    return createSuccessResponse({ medication: newMedication });
  } catch (error: any) {
    console.error('Error creating medication:', { error: error.message });
    return createErrorResponse('Failed to add medication', 500);
  }
}