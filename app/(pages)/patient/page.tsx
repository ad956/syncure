import DashboardClient from "./components/DashboardClient";
import { getSession } from "@lib/auth/get-session";
import { redirect } from "next/navigation";

export default async function PatientPage() {
  const session = await getSession();
  
  if (!session?.user?.id) {
    redirect('/login');
  }
  
  const patientId = session.user.id;

  return <DashboardClient patientId={patientId} />;
}
