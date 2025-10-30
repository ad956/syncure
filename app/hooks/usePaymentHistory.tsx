import useSWR from 'swr';
import { ApiResponse } from '@lib/api-response';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function usePaymentHistory() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<any>>(
    '/api/patient/payment-history',
    fetcher
  );

  return {
    paymentHistory: data?.success && data.data?.transactions ? data.data.transactions : [],
    isLoading,
    error: data?.success === false ? data.data : error,
    refetch: mutate
  };
}