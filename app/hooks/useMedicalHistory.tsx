import useSWR from 'swr';
import { ApiResponse } from '@lib/api-response';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useMedicalHistory() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<any>>(
    '/api/patient/medical-history',
    fetcher
  );

  return {
    medicalHistory: data?.success ? data.data : [],
    isLoading,
    error: data?.success === false ? data.data : error,
    refetch: mutate
  };
}