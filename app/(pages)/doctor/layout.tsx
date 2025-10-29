"use client";

import Headbar from "@components/Headbar";
import Sidebar from "@components/Sidebar";
import { useDoctor } from "@hooks/useDoctor";
import SpinnerLoader from "@components/SpinnerLoader";

export default function DoctorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { doctor, isLoading } = useDoctor();

  if (isLoading) {
    return <SpinnerLoader />;
  }

  if (!doctor) {
    return <div>Error loading doctor data</div>;
  }

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
