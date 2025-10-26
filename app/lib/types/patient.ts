export interface PatientDashboard {
  patient: {
    id: string;
    name: string;
    firstname: string;
    email: string;
    contact: string;
    profile: string;
    physicalDetails: {
      age?: number;
      blood?: string;
      height?: number;
      weight?: number;
    };
    updatedAt: string;
  };
  healthMetrics: {
    healthScore: number;
    activeMedications: number;
    bmiStatus: string;
    bmi: string | null;
  };
  nextAppointment: {
    date: string;
    doctor: string;
    hospital: string;
    specialty?: string;
  } | null;
}

export interface VitalSign {
  _id: string;
  weight?: number;
  systolic_bp?: number;
  diastolic_bp?: number;
  heart_rate?: number;
  temperature?: number;
  oxygen_saturation?: number;
  blood_sugar?: number;
  recorded_at: string;
}

export interface LabResult {
  _id: string;
  test_name: string;
  test_type: string;
  result_value: string;
  status: 'Normal' | 'Abnormal' | 'Critical' | 'Pending';
  test_date: string;
  lab_name: string;
  report_url?: string;
}

export interface Appointment {
  _id: string;
  date: string;
  disease: string;
  note: string;
  doctor?: {
    name: string;
    profile?: string;
    specialty?: string;
  };
}

export interface PendingBill {
  _id: string;
  hospital: string;
  amount: number;
  date: string;
}

export interface Medication {
  _id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  instructions?: string;
}