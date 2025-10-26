import { NextRequest, NextResponse } from 'next/server';
import MedicationLog from '@models/medication-log';
import dbConfig from '@utils/db';
import { getSession } from '@lib/auth/get-session';

export async function POST(request: NextRequest) {
  try {
    await dbConfig();
    const session = await getSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { medicationId, wasTaken } = await request.json();

    const medication = await MedicationLog.findOne({
      _id: medicationId,
      patient_id: (session as any).user.id
    });

    if (!medication) {
      return NextResponse.json({ error: 'Medication not found' }, { status: 404 });
    }

    // Add adherence log entry
    const adherenceEntry = {
      date: new Date(),
      was_taken: wasTaken,
      notes: wasTaken ? 'Taken via app' : 'Marked as not taken'
    };

    medication.adherence_logs.push(adherenceEntry);
    await medication.save();

    return NextResponse.json({ 
      success: true, 
      message: wasTaken ? 'Medication marked as taken' : 'Medication marked as not taken'
    });
  } catch (error) {
    console.error('Error updating medication status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}