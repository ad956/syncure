"use client";

import { useDoctor } from "@hooks/useDoctor";
import ProfileSettings from "@components/ProfileSettings";
import SpinnerLoader from "@components/SpinnerLoader";

export default function Settings() {
  const { doctor, isLoading } = useDoctor();

  if (isLoading) {
    return <SpinnerLoader />;
  }

  if (!doctor) {
    return <div>Error loading doctor data</div>;
  }

  return (
    <section className="h-full w-full flex flex-col overflow-y-auto">
      <ProfileSettings user={doctor} />
    </section>
  );
}
