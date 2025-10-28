'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileSettings from '@components/ProfileSettings';
import { getClientSession } from '@lib/auth/client-session';

export default function SettingsClient() {
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const sessionData = await getClientSession();
        const session = sessionData?.data;
        
        if (!session?.user?.id) {
          router.push('/login');
          return;
        }

        const response = await fetch('/api/patient', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setPatient(data.data);
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!patient) {
    return null;
  }

  return (
    <section className="h-full w-full flex flex-col overflow-y-auto bills-scroll">
      <ProfileSettings user={patient} />
    </section>
  );
}