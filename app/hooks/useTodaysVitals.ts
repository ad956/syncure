import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useTodaysVitals() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/patient/vital-signs?today=true',
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  return {
    vitals: data?.success ? data.data.vitals : [],
    count: data?.success ? data.data.count : 0,
    isLoading,
    error,
    mutate
  };
}