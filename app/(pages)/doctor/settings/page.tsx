import getDoctorData from "@lib/doctor/get-doctor-data";
import ProfileSettings from "@components/ProfileSettings";
import { auth } from "@lib/auth";

export default async function Settings() {
  const session = await getSession();
  const doctor = await getDoctorData(session?.user?.id);

  return (
    <section className="h-full w-full flex flex-col overflow-y-auto">
      <ProfileSettings user={doctor} />
    </section>
  );
}
