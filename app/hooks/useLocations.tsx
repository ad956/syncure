import useSWR from 'swr';
import { ApiResponse } from '@lib/api-response';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useStates() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<{id: string, name: string}[]>>(
    '/api/states',
    fetcher
  );

  return {
    states: data?.success ? data.data : [],
    isLoading,
    error: data?.success === false ? data.data : error,
    refetch: mutate
  };
}

export function useCities(state: string) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<string[]>>(
    state ? `/api/city?state=${state}` : null,
    fetcher
  );

  return {
    cities: data?.success ? data.data : [],
    isLoading,
    error: data?.success === false ? data.data : error,
    refetch: mutate
  };
}

export function useHospitals(state: string, city: string) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<any[]>>(
    state && city ? `/api/get-hospitals?state=${state}&city=${city}` : null,
    fetcher
  );

  return {
    hospitals: data?.success ? data.data : [],
    isLoading,
    error: data?.success === false ? data.data : error,
    refetch: mutate
  };
}