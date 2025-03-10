import type { Metadata } from "next";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import getAdminData from "@lib/admin/get-admin-data";

export const metadata: Metadata = {
  title: "Syncure - Admin",
  description: "Admin dashboard for Syncure application.",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await getAdminData();

  return (
    <main className="h-screen flex flex-row">
      <Sidebar />
      <section className="flex flex-col w-full overflow-hidden">
        <Header admin={admin} />
        {children}
      </section>
    </main>
  );
}
