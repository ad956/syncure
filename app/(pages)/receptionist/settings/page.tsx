import ProfileSettings from "@components/ProfileSettings";
import getReceptionistData from "@lib/receptionist/get-receptionist-data";

export default async function Settings() {
  const receptionist: Receptionist = await getReceptionistData();

  return (
    <section className="h-full w-full flex flex-col overflow-y-auto">
      <ProfileSettings user={receptionist} />
    </section>
  );
}
