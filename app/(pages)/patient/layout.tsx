import Script from "next/script";
import Sidebar from "@components/Sidebar";
import Headbar from "@components/Headbar";
import getPatientData from "@lib/patient/get-patient-data";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syncure",
  description: "The page is for patient related applications.",
};

export default async function PatientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const patient = await getPatientData();

  return (
    <main className="h-screen flex">
      <Sidebar userType="patient" />
      <section className="flex flex-col w-full">
        <Headbar user={patient} role="patient" />
        {children}
      </section>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
    </main>
  );
}
