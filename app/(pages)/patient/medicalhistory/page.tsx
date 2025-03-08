import getPatientMedicalHistory from "@lib/patient/get-patient-medical-history";
import MedicalDetails from "../components/MedicalDetails";

export default async function MedicalHistory() {
  const response = await getPatientMedicalHistory();

  return (
    <section className="md:h-full md:w-full flex flex-col items-center scrollbar overflow-y-scroll">
      <MedicalDetails medicalDetails={response} />
    </section>
  );
}
