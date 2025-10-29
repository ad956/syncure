"use client";

import Headbar from "@components/Headbar";
import Sidebar from "@components/Sidebar";
import SpinnerLoader from "@components/SpinnerLoader";
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data, isLoading } = useSWR('/api/admin', fetcher);
  const admin = data?.success ? data.data : null;

  if (isLoading) {
    return <SpinnerLoader />;
  }

  if (!admin) {
    return <div>Error loading admin data</div>;
  }

  return (
    <main className="h-screen flex">
      <Sidebar userType="admin" />
      <section className="flex flex-col w-full">
        <Headbar user={admin} role="admin" />
        {children}
      </section>
    </main>
  );
}