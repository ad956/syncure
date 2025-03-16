import getPatientMedicalHistory from "@lib/patient/get-patient-medical-history";
import MedicalDetails from "../components/MedicalDetails";
import { auth } from "@lib/auth";

export default async function MedicalHistory() {
  const session = await auth();
  const response = await getPatientMedicalHistory(session?.user.id);

  return (
    <section className="md:h-full md:w-full flex flex-col items-center scrollbar overflow-y-scroll">
      <MedicalDetails medicalDetails={response} />
    </section>
  );
}
