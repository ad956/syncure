import ProfileSettings from "@components/ProfileSettings";
import getReceptionistData from "@lib/receptionist/get-receptionist-data";
import { getSession } from "@lib/auth/get-session";

export default async function Settings() {
  const session = await getSession();
  const receptionist = await getReceptionistData((session as any)?.user?.id);

  return (
    <section className="h-full w-full flex flex-col overflow-y-auto">
      <ProfileSettings user={receptionist} />
    </section>
  );
}
