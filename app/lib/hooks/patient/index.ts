import useSWR from 'swr';
import { 
  MedicalHistory, 
  PaymentHistory, 
  BookedAppointments, 
  DoctorChat, 
  LabResult, 
  PendingBill,
  medicalHistoryResponseSchema,
  paymentHistoryResponseSchema,
  bookedAppointmentsSchema
} from '@lib/validations/patient';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  
  if (!res.ok) {
    const errorMsg = data.error || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  
  if (!data.success) {
    throw new Error(data.error || 'Request was not successful');
  }
  
  return data.data || data;
};

// Patient Profile Hook
export function usePatientProfile() {
  const { data, error, isLoading, mutate } = useSWR('/api/patient', fetcher);
  
  return {
    patient: data,
    isLoading,
    error,
    mutate
  };
}

// Medical History Hook
export function useMedicalHistory() {
  const { data, error, isLoading, mutate } = useSWR('/api/patient/medical-history', fetcher);
  
  const validatedData = data ? medicalHistoryResponseSchema.safeParse(data) : null;
  
  return {
    medicalHistory: validatedData?.success ? validatedData.data : data || [],
    isLoading,
    error: error || (validatedData && !validatedData.success ? validatedData.error : null),
    mutate
  };
}

// Payment History Hook
export function usePaymentHistory() {
  const { data, error, isLoading, mutate } = useSWR('/api/patient/payment-history', fetcher);
  
  const validatedData = data ? paymentHistoryResponseSchema.safeParse(data) : null;
  
  return {
    paymentHistory: validatedData?.success ? validatedData.data : data || [],
    isLoading,
    error: error || (validatedData && !validatedData.success ? validatedData.error : null),
    mutate
  };
}

// Appointments Hook
export function useAppointments() {
  const { data, error, isLoading, mutate } = useSWR('/api/patient/appointments', fetcher);
  
  // Handle nested appointments array from API response
  const appointments = data?.appointments || data || [];
  
  return {
    appointments: data?.appointments || [],
    isLoading,
    error,
    mutate
  };
}

// Pending Bills Hook
export function usePendingBills() {
  const { data, error, isLoading, mutate } = useSWR('/api/patient/bills/pending', fetcher);
  
  return {
    pendingBills: data?.bills || [],
    isLoading,
    error,
    mutate
  };
}

// Lab Results Hook
export function useLabResults() {
  const { data, error, isLoading, mutate } = useSWR('/api/patient/lab-results', fetcher);
  
  return {
    labResults: data?.labResults || [],
    isLoading,
    error,
    mutate
  };
}

// Doctor Chat List Hook
export function useDoctorChatList() {
  const { data, error, isLoading, mutate } = useSWR('/api/patient/dashboard/doctors-chat-list', fetcher);
  
  return {
    doctorChats: Array.isArray(data) ? data : [],
    isLoading,
    error,
    mutate
  };
}

// Health Trends Hook
export function useHealthTrends() {
  const { data, error, isLoading, mutate } = useSWR('/api/patient/health-trends', fetcher);
  
  return {
    healthTrends: data?.vitalSigns || [],
    isLoading,
    error,
    mutate
  };
}

// Vital Signs Hook
export function useVitalSigns() {
  const { data, error, isLoading, mutate } = useSWR('/api/patient/vital-signs', fetcher);
  
  return {
    vitalSigns: data?.vitals || [],
    isLoading,
    error,
    mutate
  };
}

// Medications Hook
export function useMedications() {
  const { data, error, isLoading, mutate } = useSWR('/api/patient/medications', fetcher);
  
  return {
    medications: data?.medications || [],
    isLoading,
    error,
    mutate
  };
}

// Family Members Hook
export function useFamilyMembers() {
  const { data, error, isLoading, mutate } = useSWR('/api/patient/family-members', fetcher);
  
  return {
    familyMembers: data?.family_members || [],
    isLoading,
    error,
    mutate
  };
}