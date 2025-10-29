import useSWR from 'swr';
import { ApiResponse } from '@lib/api-response';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useReceptionist() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<any>>(
    '/api/receptionist',
    fetcher
  );

  return {
    receptionist: data?.success ? data.data : null,
    isLoading,
    error: data?.success === false ? data.data : error,
    refetch: mutate
  };
}