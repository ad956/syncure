"use client";

import ChatInterface from "@components/ChatScreen/ChatInterface";
import { usePatient } from "@hooks/usePatient";
import SpinnerLoader from "@components/SpinnerLoader";

export default function PatientChatPage() {
  const { patient, isLoading } = usePatient();

  if (isLoading) {
    return <SpinnerLoader />;
  }

  if (!patient) {
    return <div>Error loading patient data</div>;
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