// TODO: Import Better Auth
import Headbar from "@components/Headbar";
import Sidebar from "@components/Sidebar";
import getHospitalData from "@lib/hospital/get-hospital-data";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syncure",
  description: "The page is for hospital related applications.",
};

export default async function HospitalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TODO: Replace with Better Auth session
  const hospital = await getHospitalData('temp-hospital-id');

  return (
    <main className="h-screen flex">
      <Sidebar userType="hospital" />
      <section className="flex flex-col w-full">
        <Headbar user={hospital} role="hospital" />
        {children}
      </section>
    </main>
  );
}
