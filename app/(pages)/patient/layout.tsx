"use client";

import Script from "next/script";
import Sidebar from "@components/Sidebar";
import Headbar from "@components/Headbar";
import { usePatient } from "@hooks/usePatient";
import SpinnerLoader from "@components/SpinnerLoader";

export default function PatientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { patient, isLoading } = usePatient();

  if (isLoading) {
    return <SpinnerLoader />;
  }

  if (!patient) {
    return <div>Error loading patient data</div>;
  }

  return (
    <main className="h-screen flex bg-gray-50">
      <Sidebar userType="patient" />
      <section className="flex flex-col flex-1 min-w-0">
        <Headbar user={patient} role="patient" />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </section>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
    </main>
  );
}
