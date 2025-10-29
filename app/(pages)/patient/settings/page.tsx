"use client";

import ProfileSettings from "@components/ProfileSettings";
import { usePatient } from "@hooks/usePatient";
import SpinnerLoader from "@components/SpinnerLoader";

export default function Settings() {
  const { patient, isLoading } = usePatient();

  if (isLoading) {
    return <SpinnerLoader />;
  }

  if (!patient) {
    return <div>Error loading patient data</div>;
  }

  return (
    <section className="h-full w-full flex flex-col overflow-y-auto bills-scroll">
      <ProfileSettings user={patient} />
    </section>
  );
}
