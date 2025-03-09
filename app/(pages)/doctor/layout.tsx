import Headbar from "@components/Headbar";
import Sidebar from "@components/Sidebar";
import getDoctorData from "@lib/doctor/get-doctor-data";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syncure",
  description: "The page is for doctor related applications.",
};

export default async function DoctorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const doctor = await getDoctorData();

  return (
    <main className="h-screen flex">
      <Sidebar userType="doctor" />
      <section className="flex flex-col w-full">
        <Headbar user={doctor} role="doctor" />
        {children}
      </section>
    </main>
  );
}
