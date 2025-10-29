"use client";

import BookAppointment from "../components/BookAppointment";
import { usePatient } from "@hooks/usePatient";
import SpinnerLoader from "@components/SpinnerLoader";

export default function Appointments() {
  const { patient, isLoading } = usePatient();

  if (isLoading) {
    return <SpinnerLoader />;
  }

  if (!patient) {
    return <div>Error loading patient data</div>;
  }

  return (
    <BookAppointment
      patientId={patient._id}
      name={`${patient.firstname} ${patient.lastname}`}
      email={patient.email}
    />
  );
}
