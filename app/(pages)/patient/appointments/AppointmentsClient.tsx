'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BookAppointment from "../components/BookAppointment";
import { getClientSession } from '@lib/auth/client-session';

export default function AppointmentsClient() {
  const [patientData, setPatientData] = useState<any>(null);
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
          setPatientData(data.data);
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

  if (!patientData) {
    return null;
  }

  return (
    <BookAppointment
      patientId={patientData._id}
      name={`${patientData.firstname} ${patientData.lastname}`}
      email={patientData.email}
    />
  );
}