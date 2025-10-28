'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardClient from './components/DashboardClient';
import { getClientSession } from '@lib/auth/client-session';

export default function PatientPageClient() {
  const [patientId, setPatientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionData = await getClientSession();
        const session = sessionData?.data;
        
        if (!session?.user?.id) {
          router.push('/login');
          return;
        }
        
        setPatientId(session.user.id);
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!patientId) {
    return null;
  }

  return <DashboardClient patientId={patientId} />;
}