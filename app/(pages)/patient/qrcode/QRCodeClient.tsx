'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Link, User } from "@nextui-org/react";
import QRCode from "../components/QR";
import { getClientSession } from '@lib/auth/client-session';

export default function QRCodeClient() {
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
    <Card
      shadow="lg"
      className="h-full flex flex-row justify-around items-center"
    >
      <div className="md:h-4/5 md:w-2/6 flex flex-col justify-center gap-5 items-center">
        <User
          name={patient.firstname}
          description={
            <Link size="sm" isExternal>
              @{patient.username}
            </Link>
          }
          avatarProps={{
            src: `${patient.profile}`,
          }}
        />

        <div className="flex flex-col justify-center items-center gap-2 px-5">
          <p className="text-sm font-semibold">
            Quick Patient Verification via QR Code
          </p>
          <p className="text-xs text-center">
            Receptionists can scan this code to verify your identity instantly
            and access your medical records for a smoother check-in process.
          </p>
        </div>

        <QRCode text={patient.email} />
      </div>
    </Card>
  );
}