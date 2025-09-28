export const dynamic = 'force-dynamic';

import getPatientData from "@lib/patient/get-patient-data";
import ProfileSettings from "@components/ProfileSettings";
import { getSession } from "@lib/auth/get-session";

export default async function Settings() {
  const session = await getSession();
  const patient = await getPatientData((session as any)?.user?.id);

  return (
    <section className="h-full w-full flex flex-col overflow-y-auto">
      <ProfileSettings user={patient} />
    </section>
  );
}
