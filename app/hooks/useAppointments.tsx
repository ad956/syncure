import useSWR from 'swr';
import { ApiResponse } from '@lib/api-response';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useAppointments(status = 'all', limit = 10) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<any>>(
    `/api/patient/appointments?status=${status}&limit=${limit}`,
    fetcher
  );

  const bookAppointment = async (appointmentData: any) => {
    const response = await fetch('/api/patient/appointments/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData)
    });
    const result = await response.json();
    if (result.success) {
      mutate();
    }
    return result;
  };

  return {
    appointments: data?.success ? data.data.appointments : [],
    count: data?.success ? data.data.count : 0,
    isLoading,
    error: data?.success === false ? data.data : error,
    refetch: mutate,
    bookAppointment
  };
}