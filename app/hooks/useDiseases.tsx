import useSWR from 'swr';
import { ApiResponse } from '@lib/api-response';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useDiseases(hospitalId?: string) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<string[]>>(
    hospitalId ? '/api/get-hospitals/disease/' : null,
    fetcher
  );

  return {
    diseases: data?.success ? data.data : [],
    isLoading,
    error: data?.success === false ? data.data : error,
    refetch: mutate
  };
}