import useSWR from 'swr';
import { ApiResponse } from '@lib/api-response';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useHospital() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<any>>(
    '/api/hospital',
    fetcher
  );

  return {
    hospital: data?.success ? data.data : null,
    isLoading,
    error: data?.success === false ? data.data : error,
    refetch: mutate
  };
}

export function useHospitalDetails() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<any>>(
    '/api/hospital/additional-details',
    fetcher
  );

  return {
    hospitalDetails: data?.success ? data.data : null,
    isLoading,
    error: data?.success === false ? data.data : error,
    refetch: mutate
  };
}