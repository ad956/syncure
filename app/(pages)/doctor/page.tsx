export const dynamic = 'force-dynamic';

import getDoctorData from "@lib/doctor/get-doctor-data";
import Dashboard from "./components/Dashboard";
import { getSession } from "@lib/auth/get-session";

export default async function Doctor() {
  const session = await getSession();
  const doctor = await getDoctorData((session as any)?.user?.id);

  return <Dashboard doctor={doctor} />;
}
