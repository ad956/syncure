import getAdminData from "@lib/admin/get-admin-data";
import ProfileSettings from "@components/ProfileSettings";
import { auth } from "@lib/auth";

export default async function Settings() {
  const session = await auth();
  const admin = await getAdminData(session?.user.id);

  return (
    <section className="h-screen w-full flex flex-col">
      <ProfileSettings user={admin} />
    </section>
  );
}
