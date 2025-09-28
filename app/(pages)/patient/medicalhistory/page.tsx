export const dynamic = 'force-dynamic';

import getPatientMedicalHistory from "@lib/patient/get-patient-medical-history";
import MedicalDetails from "../components/MedicalDetails";
import { getSession } from "@lib/auth/get-session";

export default async function MedicalHistory() {
  const session = await getSession();
  const response = await getPatientMedicalHistory((session as any)?.user?.id);

  return (
    <section className="md:h-full md:w-full flex flex-col items-center scrollbar overflow-y-scroll">
      <MedicalDetails medicalDetails={response} />
    </section>
  );
}
