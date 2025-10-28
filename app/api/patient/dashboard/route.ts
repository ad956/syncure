import { NextResponse } from 'next/server';
import Patient from '@models/patient';
import VitalSigns from '@models/vital-signs';
import BookedAppointment from '@models/booked-appointment';
import MedicationLog from '@models/medication-log';
import dbConfig from '@utils/db';
import { requireAuth } from '@lib/auth/api-auth';
import { createSuccessResponse, createErrorResponse } from '@lib/api-response';



export async function GET() {
  try {
    await dbConfig();
    const { error, session } = requireAuth();
    
    if (error) {
      return error;
    }

    const patientId = (session as any).user.id;

    // Parallel queries for dashboard summary only
    const [patient, todaysVitals, nextAppointment, activeMedications] = await Promise.all([
      Patient.findById(patientId, { role: 0, otp: 0, password: 0 }),
      VitalSigns.findOne({ patient_id: patientId }).sort({ recorded_at: -1 }),
      BookedAppointment.findOne({ 
        patient_id: patientId, 
        approved: 'approved'
      }).sort({ createdAt: 1 }),
      MedicationLog.countDocuments({ patient_id: patientId, is_active: true })
    ]);

    if (!patient) {
      return createErrorResponse('Patient not found', 404);
    }

    // Calculate BMI and health metrics
    let bmi = null;
    let bmiStatus = 'Normal';
    if (patient.physicalDetails?.height && patient.physicalDetails?.weight) {
      bmi = (patient.physicalDetails.weight / Math.pow(patient.physicalDetails.height / 100, 2));
      if (bmi < 18.5) bmiStatus = 'Underweight';
      else if (bmi >= 25) bmiStatus = 'Overweight';
      bmi = bmi.toFixed(1);
    }

    const healthScore = Math.min(85 + (activeMedications > 0 ? 10 : 0) + (todaysVitals ? 5 : 0), 100);

    const dashboardData = {
      patient: {
        id: patient._id,
        name: `${patient.firstname} ${patient.lastname}`,
        firstname: patient.firstname,
        email: patient.email,
        contact: patient.contact,
        profile: patient.profile,
        physicalDetails: patient.physicalDetails,
        updatedAt: patient.updatedAt,
      },
      healthMetrics: {
        healthScore,
        activeMedications,
        bmiStatus,
        bmi,
      },
      nextAppointment: nextAppointment ? {
        date: nextAppointment.date || nextAppointment.createdAt,
        doctor: { 
          name: 'Dr. John Smith',
          specialty: 'General Medicine',
          profile: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
        },
        hospital: {
          id: nextAppointment.hospital?.id,
          name: nextAppointment.hospital?.name || 'General Hospital'
        },
        disease: nextAppointment.disease,
        note: nextAppointment.note,
        createdAt: nextAppointment.createdAt,
        timing: nextAppointment.timing || {
          startTime: '10:00 AM',
          endTime: '11:00 AM'
        },
        city: nextAppointment.city || 'Mumbai',
        state: nextAppointment.state || 'Maharashtra',
        booked_for: nextAppointment.booked_for || { type: 'self' }
      } : null,
      todaysVitals: todaysVitals ? [todaysVitals] : []
    };

    const response = createSuccessResponse(dashboardData);
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return response;
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    return createErrorResponse(
      'Failed to fetch dashboard data', 
      500, 
      process.env.NODE_ENV === 'development' ? error.message : undefined
    );
  }
}