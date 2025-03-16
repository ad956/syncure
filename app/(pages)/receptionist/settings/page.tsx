import ProfileSettings from "@components/ProfileSettings";
import getReceptionistData from "@lib/receptionist/get-receptionist-data";
import { auth } from "@lib/auth";

export default async function Settings() {
  const session = await auth();
  const receptionist = await getReceptionistData(session?.user.id);

  return (
    <section className="h-full w-full flex flex-col overflow-y-auto">
      <ProfileSettings user={receptionist} />
    </section>
  );
}
