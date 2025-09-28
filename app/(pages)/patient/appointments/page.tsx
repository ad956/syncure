export const dynamic = 'force-dynamic';

import { Card, Image } from "@nextui-org/react";
import BookAppointment from "../components/BookAppointment";
import getPatientData from "@lib/patient/get-patient-data";
import { getSession } from "@lib/auth/get-session";

export default async function Appointments() {
  const session = await getSession();
  const patient = await getPatientData((session as any)?.user?.id);

  const { _id, firstname, lastname, email } = patient;

  return (
    <section className="flex flex-col gap-5 p-5 overflow-y-auto">
      <Card
        radius="lg"
        className="border-none flex flex-col justify-center md:flex-row md:justify-around items-center py-52 px-2 md:p-0 md:mx-5"
      >
        <div className="flex flex-col gap-2">
          <div className="">
            <p className="text-2xl font-bold">
              Welcome to your appointment section,
            </p>
            <p className="text-2xl font-semibold">{patient.firstname} !</p>
          </div>
          <p className="text-tiny text-black/80 my-2">
            To book an appointment, first, select your city. Then, choose a
            hospital within that city. Finally, provide your details to confirm
            the appointment.
          </p>
        </div>
        <Image
          alt="Appointment Booking Instuc"
          className="object-cover"
          height={200}
          src="/images/appointment1.png"
          width={200}
        />
      </Card>

      <BookAppointment
        patientId={_id}
        name={`${firstname} ${lastname}`}
        email={email}
      />
    </section>
  );
}
