import getAdminData from "@lib/admin/get-admin-data";
import ProfileSettings from "@components/ProfileSettings";
import { getSession } from "@lib/auth/get-session";

export default async function Settings() {
  const session = await getSession();
  const admin = await getAdminData((session as any)?.user?.id);

  return (
    <section className="h-screen w-full flex flex-col">
      <ProfileSettings user={admin} />
    </section>
  );
}
