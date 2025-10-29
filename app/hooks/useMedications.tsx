import useSWR from 'swr';
import { ApiResponse } from '@lib/api-response';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useMedications() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<any>>(
    '/api/patient/medications',
    fetcher
  );

  const addMedication = async (medicationData: any) => {
    const response = await fetch('/api/patient/medications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medicationData)
    });
    const result = await response.json();
    if (result.success) {
      mutate();
    }
    return result;
  };

  const takeMedication = async (medicationId: string) => {
    const response = await fetch('/api/patient/medications/take', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medication_id: medicationId })
    });
    const result = await response.json();
    if (result.success) {
      mutate();
    }
    return result;
  };

  return {
    medications: data?.success ? data.data.medications : [],
    count: data?.success ? data.data.count : 0,
    isLoading,
    error: data?.success === false ? data.data : error,
    refetch: mutate,
    addMedication,
    takeMedication
  };
}