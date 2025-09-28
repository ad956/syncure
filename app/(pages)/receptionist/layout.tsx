export const dynamic = 'force-dynamic';

import Headbar from "@components/Headbar";
import Sidebar from "@components/Sidebar";
import getReceptionistData from "@lib/receptionist/get-receptionist-data";
import { getSession } from "@lib/auth/get-session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syncure - Receptionist",
  description: "The page is for receptionist related applications.",
};

export default async function ReceptionistLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const receptionist = await getReceptionistData((session as any)?.user?.id);

  if (!receptionist) {
    return <div>Loading...</div>;
  }

  return (
    <main className="h-screen flex">
      <Sidebar userType="receptionist" />
      <section className="flex flex-col w-full">
        <Headbar user={receptionist} role="receptionist" />
        {children}
      </section>
    </main>
  );
}