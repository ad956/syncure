import { NextRequest, NextResponse } from 'next/server';
import MedicationLog from "@models/medication-log";
import Patient from "@models/patient";
import dbConfig from "@utils/db";
import { getSession } from "@lib/auth/get-session";

export async function DELETE(request: NextRequest) {
  try {
    await dbConfig();
    const session = await getSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const medicationId = searchParams.get('id');

    if (!medicationId) {
      return NextResponse.json({ error: 'Medication ID required' }, { status: 400 });
    }

    const medication = await MedicationLog.findById(medicationId);
    
    if (!medication || medication.patient_id.toString() !== (session as any).user.id) {
      return NextResponse.json({ error: 'Medication not found' }, { status: 404 });
    }

    // Mark as inactive instead of deleting
    medication.is_active = false;
    medication.end_date = new Date();
    await medication.save();

    // Update patient's active medications count
    await Patient.findByIdAndUpdate((session as any).user.id, {
      $inc: { activeMedications: -1 }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing medication:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}