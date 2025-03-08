import getDoctorData from "@lib/doctor/get-doctor-data";
import Dashboard from "./components/Dashboard";

export default async function Doctor() {
  const doctor = await getDoctorData();
  return <Dashboard doctor={doctor} />;
}
