export const dynamic = 'force-dynamic';

import ChatScreen from "@components/ChatScreen";
import getPatientData from "@lib/patient/get-patient-data";
import { getSession } from "@lib/auth/get-session";

export default async function PatientChatPage() {
  const session = await getSession();
  const patient = await getPatientData((session as any)?.user?.id);

  const currentUser = {
    _id: patient._id,
    firstname: patient.firstname,
    lastname: patient.lastname,
    profile: patient.profile,
    role: "Patient" as const,
  };

  return (
    <div className="h-full bg-[#f3f6fd] p-4">
      <div className="h-full max-w-4xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Chat with Doctors</h1>
          <p className="text-gray-600">Get medical advice and support from your healthcare providers</p>
        </div>
        <div className="h-[calc(100%-80px)]">
          <ChatScreen currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
}