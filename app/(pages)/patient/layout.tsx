import PatientLayoutClient from "./PatientLayoutClient";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syncure",
  description: "The page is for patient related applications.",
};

export default function PatientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PatientLayoutClient>
      {children}
    </PatientLayoutClient>
  );
}
