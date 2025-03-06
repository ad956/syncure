import Headbar from "@components/Headbar";
import Sidebar from "@components/Sidebar";

import type { Metadata } from "next";
import { getReceptionistData } from "@lib/receptionist";

export const metadata: Metadata = {
  title: "Syncure",
  description: "The page is for receptionist related applications.",
};

export default async function ReceptionistLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const receptionist: Receptionist = await getReceptionistData();

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
