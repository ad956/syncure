import getHospitalData from "@lib/hospital/get-hospital-data";
import ProfileSettings from "@components/ProfileSettings";
import { auth } from "@lib/auth";

export default async function Settings() {
  const session = await auth();
  const Hospital = await getHospitalData(session?.user.id);

  return (
    <section className="h-full w-full flex flex-col overflow-y-auto">
      <ProfileSettings user={Hospital} />
    </section>
  );
}
