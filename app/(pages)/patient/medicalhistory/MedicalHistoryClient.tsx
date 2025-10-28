'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MedicalDetails from '../components/MedicalDetails';
import { getClientSession } from '@lib/auth/client-session';

export default function MedicalHistoryClient() {
  const [medicalHistory, setMedicalHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        const sessionData = await getClientSession();
        const session = sessionData?.data;
        
        if (!session?.user?.id) {
          router.push('/login');
          return;
        }

        const response = await fetch('/api/patient/medical-history', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setMedicalHistory(data.data);
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalHistory();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section className="md:h-full md:w-full flex flex-col items-center bills-scroll overflow-y-auto">
      <MedicalDetails medicalDetails={medicalHistory} />
    </section>
  );
}