"use client";

import { useMedicalHistory } from "@hooks/useMedicalHistory";
import MedicalDetails from "../components/MedicalDetails";
import SpinnerLoader from "@components/SpinnerLoader";

export default function MedicalHistory() {
  const { medicalHistory, isLoading } = useMedicalHistory();

  if (isLoading) {
    return <SpinnerLoader />;
  }

  return (
    <section className="md:h-full md:w-full flex flex-col items-center bills-scroll overflow-y-auto">
      <MedicalDetails medicalDetails={medicalHistory} />
    </section>
  );
}
