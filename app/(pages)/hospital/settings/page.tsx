import getHospitalData from "@lib/hospital/get-hospital-data";
import ProfileSettings from "@components/ProfileSettings";

export default async function Settings() {
  const Hospital = await getHospitalData();

  return (
    <section className="h-full w-full flex flex-col overflow-y-auto">
      <ProfileSettings user={Hospital} />
    </section>
  );
}
