'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatInterface from "@components/ChatScreen/ChatInterface";
import { getClientSession } from '@lib/auth/client-session';

export default function ChatClient() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
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
          const patient = data.data;
          
          setCurrentUser({
            _id: patient._id,
            firstname: patient.firstname,
            lastname: patient.lastname,
            profile: patient.profile,
            role: "Patient" as const,
          });
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="h-full overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ChatInterface currentUser={currentUser} />
    </div>
  );
}