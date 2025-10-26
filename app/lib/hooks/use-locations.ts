'use client';

import useSWR from 'swr';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

function useErrorHandler(error: any, componentName: string) {
  useEffect(() => {
    if (error) {
      toast.error(`Failed to load ${componentName}`, {
        id: `${componentName}-error`,
        duration: 4000,
      });
    }
  }, [error, componentName]);
}

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  const data = await res.json();
  return data.success ? data.data : data;
};

export function useStates() {
  const { data, error, isLoading } = useSWR('/api/locations?type=states', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 3600000, // 1 hour
  });

  useErrorHandler(error, 'states');
  
  console.log('States data:', data);

  return {
    states: data?.states || [],
    loading: isLoading,
    error,
  };
}

export function useCities(stateId: string) {
  const { data, error, isLoading } = useSWR(
    stateId ? `/api/locations?type=cities&state=${stateId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 3600000,
    }
  );

  useErrorHandler(error, 'cities');

  return {
    cities: data?.cities || [],
    loading: isLoading,
    error,
  };
}

export function useHospitals(cityId: string) {
  const { data, error, isLoading } = useSWR(
    cityId ? `/api/locations?type=hospitals&city=${cityId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 1800000, // 30 minutes
    }
  );

  useErrorHandler(error, 'hospitals');

  return {
    hospitals: data?.hospitals || [],
    loading: isLoading,
    error,
  };
}

export function useFamilyMembers() {
  const { data, error, isLoading, mutate } = useSWR('/api/patient/family-members', fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 60000,
  });

  useErrorHandler(error, 'family members');

  return {
    familyMembers: data?.family_members || [],
    loading: isLoading,
    error,
    refetch: mutate,
  };
}