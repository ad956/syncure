import Script from "next/script";
import Sidebar from "@components/Sidebar";
import Headbar from "@components/Headbar";
import getPatientData from "@lib/patient/get-patient-data";

import type { Metadata } from "next";
import { getSession } from "@lib/auth/get-session";

export const metadata: Metadata = {
  title: "Syncure",
  description: "The page is for patient related applications.",
};

export default async function PatientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const patient = await getPatientData(session?.user?.id);

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
