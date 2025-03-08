import getDoctorData from "@lib/doctor/get-doctor-data";
import ProfileSettings from "@components/ProfileSettings";

export default async function Settings() {
  const doctor = await getDoctorData();

  return (
    <section className="h-full w-full flex flex-col overflow-y-auto">
      <ProfileSettings user={doctor} />
    </section>
  );
}
