import DashboardClient from "./components/DashboardClient";
import { getSession } from "@lib/auth/get-session";

export default async function PatientPage() {
  const session = await getSession();
  const patientId = session?.user?.id || '';

  return <DashboardClient patientId={patientId} />;
}
