import useSWR, { SWRResponse } from "swr";

export default function useQuery<T = any>(url: string | null) {
  const fetcher = (...args: [string]) =>
    fetch(...args).then((res) => res.json()) as Promise<T>;

  const { data, error, isLoading, mutate }: SWRResponse<T, Error> = useSWR<
    T,
    Error
  >(url, fetcher);

  return {
    data,
    isLoading,
    error,
    refetch: mutate,
  };
}
