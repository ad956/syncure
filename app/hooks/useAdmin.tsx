import useSWR from 'swr';
import { ApiResponse } from '@lib/api-response';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useRecentUsers(page = 1, limit = 10) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<any>>(
    `/api/admin/dashboard/recent-users?page=${page}&limit=${limit}`,
    fetcher
  );

  return {
    users: data?.success ? data.data.users : [],
    totalPages: data?.success ? data.data.totalPages : 0,
    isLoading,
    error: data?.success === false ? data.data : error,
    refetch: mutate
  };
}

export function useHospitals() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<any>>(
    '/api/admin/hospitals',
    fetcher
  );

  return {
    hospitals: data?.success ? data.data : [],
    isLoading,
    error: data?.success === false ? data.data : error,
    refetch: mutate
  };
}