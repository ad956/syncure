export const dynamic = 'force-dynamic';

import Headbar from "@components/Headbar";
import Sidebar from "@components/Sidebar";
import getAdminData from "@lib/admin/get-admin-data";
import { getSession } from "@lib/auth/get-session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syncure - Admin",
  description: "The page is for admin related applications.",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const admin = await getAdminData((session as any)?.user?.id);

  if (!admin) {
    return <div>Loading...</div>;
  }

  return (
    <main className="h-screen flex">
      <Sidebar userType="admin" />
      <section className="flex flex-col w-full">
        <Headbar user={admin} role="admin" />
        {children}
      </section>
    </main>
  );
}