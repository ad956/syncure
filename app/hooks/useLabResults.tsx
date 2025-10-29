import useSWR from 'swr';
import { ApiResponse } from '@lib/api-response';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useLabResults() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<any>>(
    '/api/patient/lab-results',
    fetcher
  );

  return {
    labResults: data?.success ? data.data.labResults || [] : [],
    isLoading,
    error: data?.success === false ? data.data : error,
    refetch: mutate
  };
}