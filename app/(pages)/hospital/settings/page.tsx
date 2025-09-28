export const dynamic = 'force-dynamic';

import getHospitalData from "@lib/hospital/get-hospital-data";
import ProfileSettings from "@components/ProfileSettings";
import { getSession } from "@lib/auth/get-session";

export default async function Settings() {
  const session = await getSession();
  const Hospital = await getHospitalData((session as any)?.user?.id);

  return (
    <section className="h-full w-full flex flex-col overflow-y-auto">
      <ProfileSettings user={Hospital} />
    </section>
  );
}
