'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from "next/script";
import Sidebar from "@components/Sidebar";
import Headbar from "@components/Headbar";
import { getClientSession } from '@lib/auth/client-session';

interface PatientLayoutClientProps {
  children: React.ReactNode;
}

export default function PatientLayoutClient({ children }: PatientLayoutClientProps) {
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
    <main className="h-screen flex bg-gray-50">
      <Sidebar userType="patient" />
      <section className="flex flex-col flex-1 min-w-0">
        <Headbar user={patient} role="patient" />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </section>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
    </main>
  );
}