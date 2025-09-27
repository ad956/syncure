import Headbar from "@components/Headbar";
import Sidebar from "@components/Sidebar";

import type { Metadata } from "next";
import getReceptionistData from "@lib/receptionist/get-receptionist-data";
import { auth } from "@lib/auth";

export const metadata: Metadata = {
  title: "Syncure",
  description: "The page is for receptionist related applications.",
};

export default async function ReceptionistLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession();
  const receptionist = await getReceptionistData(session?.user.id);

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
