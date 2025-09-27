import getDoctorData from "@lib/doctor/get-doctor-data";
import Dashboard from "./components/Dashboard";
import { auth } from "@lib/auth";

export default async function Doctor() {
  const session = await auth.api.getSession();
  const doctor = await getDoctorData(session?.user.id);

  return <Dashboard doctor={doctor} />;
}
