"use client";

import ProfileSettings from "@components/ProfileSettings";
import SpinnerLoader from "@components/SpinnerLoader";
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Settings() {
  const { data, isLoading } = useSWR('/api/admin', fetcher);
  const admin = data?.success ? data.data : null;

  if (isLoading) {
    return <SpinnerLoader />;
  }

  if (!admin) {
    return <div>Error loading admin data</div>;
  }

  return (
    <section className="h-screen w-full flex flex-col">
      <ProfileSettings user={admin} />
    </section>
  );
}
