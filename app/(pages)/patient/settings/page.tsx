import getPatientData from "@lib/patient/get-patient-data";
import ProfileSettings from "@components/ProfileSettings";
import { auth } from "@lib/auth";

export default async function Settings() {
  const session = await auth();
  const patient = await getPatientData(session?.user.id);

  return (
    <section className="h-full w-full flex flex-col overflow-y-auto">
      <ProfileSettings user={patient} />
    </section>
  );
}
