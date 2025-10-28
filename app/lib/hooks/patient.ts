'use client';

import useSWR from 'swr';
import { z } from 'zod';

// Zod schemas
const PatientProfileSchema = z.object({
  _id: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  contact: z.string(),
  profile: z.string(),
  username: z.string(),
  physicalDetails: z.object({
    weight: z.number().optional(),
    height: z.number().optional(),
  }).optional(),
  updatedAt: z.string().optional(),
});

const fetcher = async (url: string) => {
  const response = await fetch(url, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch');
  const data = await response.json();
  return data.data || data;
};

export function usePatientProfile() {
  const { data, error, isLoading, mutate } = useSWR('/api/patient', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  let patient = null;
  if (data) {
    try {
      patient = PatientProfileSchema.parse(data);
    } catch (parseError) {
      console.error('Patient validation error:', parseError);
    }
  }

  return { patient, isLoading, error: error?.message || null, mutate };
}

const AppointmentSchema = z.object({
  _id: z.string(),
  date: z.string(),
  doctor: z.object({
    name: z.string(),
    profile: z.string(),
    specialty: z.string(),
  }),
  approved: z.string(),
});

export function useAppointments() {
  const { data, error, isLoading, mutate } = useSWR('/api/patient/appointments/upcoming', fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 300000,
  });

  let appointments: any[] = [];
  if (data) {
    try {
      appointments = z.array(AppointmentSchema).parse(data);
    } catch (parseError) {
      console.error('Appointments validation error:', parseError);
      appointments = data || [];
    }
  }

  return { appointments, isLoading, error: error?.message || null, mutate };
}

export function useLabResults() {
  const { data, error, isLoading, mutate } = useSWR('/api/patient/lab-results/recent', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000,
  });

  return {
    labResults: data || [],
    isLoading,
    error: error?.message || null,
    mutate,
  };
}

export function usePendingBills() {
  const { data, error, isLoading, mutate } = useSWR('/api/patient/bills/pending', fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 600000,
  });

  return {
    pendingBills: data || [],
    isLoading,
    error: error?.message || null,
    mutate,
  };
}

export function useHealthTrends() {
  const { data, error, isLoading, mutate } = useSWR('/api/patient/health-trends', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 600000,
  });

  return {
    healthTrends: data || [],
    isLoading,
    error: error?.message || null,
    mutate,
  };
}

const MedicationSchema = z.object({
  _id: z.string(),
  medication_name: z.string(),
  dosage: z.string(),
  frequency: z.string(),
  instructions: z.string(),
});

export function useMedications() {
  const { data, error, isLoading, mutate } = useSWR('/api/patient/medications', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000,
  });

  let medications: any[] = [];
  if (data) {
    try {
      medications = z.array(MedicationSchema).parse(data);
    } catch (parseError) {
      console.error('Medications validation error:', parseError);
      medications = data || [];
    }
  }

  return {
    medications,
    isLoading,
    error: error?.message || null,
    mutate,
  };
}

export function useFamilyMembers() {
  const { data, error, isLoading, mutate } = useSWR('/api/patient/family-members', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 600000,
  });

  return {
    familyMembers: data?.family_members || [],
    isLoading,
    error: error?.message || null,
    mutate,
  };
}