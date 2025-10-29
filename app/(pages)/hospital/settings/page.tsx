"use client";

import { useHospital } from "@hooks/useHospital";
import ProfileSettings from "@components/ProfileSettings";
import SpinnerLoader from "@components/SpinnerLoader";

export default function Settings() {
  const { hospital, isLoading } = useHospital();

  if (isLoading) {
    return <SpinnerLoader />;
  }

  if (!hospital) {
    return <div>Error loading hospital data</div>;
  }

  return (
    <section className="h-full w-full flex flex-col overflow-y-auto">
      <ProfileSettings user={hospital} />
    </section>
  );
}
