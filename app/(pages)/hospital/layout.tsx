"use client";

import Headbar from "@components/Headbar";
import Sidebar from "@components/Sidebar";
import { useHospital } from "@hooks/useHospital";
import SpinnerLoader from "@components/SpinnerLoader";

export default function HospitalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { hospital, isLoading } = useHospital();

  if (isLoading) {
    return <SpinnerLoader />;
  }

  if (!hospital) {
    return <div>Error loading hospital data</div>;
  }

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