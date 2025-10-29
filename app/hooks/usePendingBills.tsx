import useSWR from 'swr';
import { ApiResponse } from '@lib/api-response';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function usePendingBills() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<any>>(
    '/api/patient/bills/pending',
    fetcher
  );

  return {
    pendingBills: data?.success ? data.data.bills || [] : [],
    isLoading,
    error: data?.success === false ? data.data : error,
    refetch: mutate
  };
}