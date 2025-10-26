export const dynamic = 'force-dynamic';

import ChatInterface from "@components/ChatScreen/ChatInterface";
import getPatientData from "@lib/patient/get-patient-data";
import { getSession } from "@lib/auth/get-session";
import { redirect } from "next/navigation";

export default async function PatientChatPage() {
  const session = await getSession();
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  const patient = await getPatientData(session.user.id);
  
  if (!patient) {
    redirect('/login');
  }

  const currentUser = {
    _id: patient._id,
    firstname: patient.firstname,
    lastname: patient.lastname,
    profile: patient.profile,
    role: "Patient" as const,
  };

  return (
    <div className="h-full overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ChatInterface currentUser={currentUser} />
    </div>
  );
}