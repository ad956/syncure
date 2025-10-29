import useSWR from 'swr';
import { ApiResponse } from '@lib/api-response';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useFamilyMembers() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<any>>(
    '/api/patient/family-members',
    fetcher
  );

  const addFamilyMember = async (memberData: any) => {
    const response = await fetch('/api/patient/family-members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memberData)
    });
    const result = await response.json();
    if (result.success) {
      mutate();
    }
    return result;
  };

  return {
    familyMembers: data?.success ? data.data.family_members : [],
    count: data?.success ? data.data.count : 0,
    isLoading,
    error: data?.success === false ? data.data : error,
    refetch: mutate,
    addFamilyMember
  };
}