import getDoctorData from "@lib/doctor/get-doctor-data";
import Dashboard from "./components/Dashboard";
// TODO: Import Better Auth

export default async function Doctor() {
  // TODO: Replace with Better Auth session
  const doctor = await getDoctorData('temp-doctor-id');

  return <Dashboard doctor={doctor} />;
}
