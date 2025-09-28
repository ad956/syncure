export const dynamic = 'force-dynamic';

import getDoctorData from "@lib/doctor/get-doctor-data";
import ProfileSettings from "@components/ProfileSettings";
import { getSession } from "@lib/auth/get-session";

export default async function Settings() {
  const session = await getSession();
  const doctor = await getDoctorData((session as any)?.user?.id);

  return (
    <section className="h-full w-full flex flex-col overflow-y-auto">
      <ProfileSettings user={doctor} />
    </section>
  );
}
