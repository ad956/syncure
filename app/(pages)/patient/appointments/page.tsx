export const dynamic = 'force-dynamic';


import BookAppointment from "../components/BookAppointment";
import getPatientData from "@lib/patient/get-patient-data";
import { getSession } from "@lib/auth/get-session";

export default async function Appointments() {
  const session = await getSession();
  console.log('Session in appointments:', session);
  
  if (!session?.user?.id) {
    return <div>No session found. Please login again.</div>;
  }
  
  const patient = await getPatientData(session.user.id);

  const { _id, firstname, lastname, email } = patient;

  return (
    <BookAppointment
      patientId={_id}
      name={`${firstname} ${lastname}`}
      email={email}
    />
  );
}
