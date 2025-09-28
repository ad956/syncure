export const dynamic = 'force-dynamic';

import { Avatar, Card, Divider, Progress } from "@nextui-org/react";
import Calendar from "./components/Calendar";
import MedicineDetails from "./components/MedicineDetails";
import { HealthConditions } from "./components/Graphs";
import PatientTabs from "./components/PatientTabs";

import getPatientData from "@lib/patient/get-patient-data";
import getUpcomingAppointments from "@lib/patient/get-upcoming-appointments";
import { getSession } from "@lib/auth/get-session";

export default async function PatientPage() {
  const session = await getSession();
  const patient = await getPatientData((session as any)?.user?.id);
  const upcomingAppointments = await getUpcomingAppointments();

  return (
    <section className="bg-[#f3f6fd] p-2 overflow-y-auto">
      <div className="flex flex-col md:grid md:grid-cols-5 md:grid-rows-5 md:h-full gap-3">
        <Card className="p-5 row-span-3 justify-center items-center">
          <div className="flex flex-col items-center">
            <Avatar size="lg" src={patient.profile} />
            <p className="text-sm font-semibold">
              {patient.firstname + " " + patient.lastname}
            </p>
            <p className="text-tiny text-gray-700">{patient.contact}</p>
          </div>

          <div className="p-5 w-full text-sm font-semibold m-2 text-black/75 flex flex-col gap-2">
            <p className="self-center">Details</p>

            <Divider className="mx-2 w-full bg-black/10" />
            <div className="mt-5 flex flex-row justify-between ">
              <div className="flex flex-col gap-2">
                <p className="">Age :</p>
                <p className="">Blood Group :</p>
                <p className="">Height (f) :</p>
                <p className="">Weight (Kg) :</p>
              </div>
              <div className="flex flex-col items-end gap-2 font-bold text-black">
                <p className="">{patient.physicalDetails.age} Year</p>
                <p className="">{patient.physicalDetails.blood} </p>
                <p className="">{patient.physicalDetails.height} </p>
                <p className="">{patient.physicalDetails.weight} </p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="col-span-1 flex justify-center gap-5 items-center p-8 md:p-5">
          <Progress
            size="sm"
            radius="sm"
            classNames={{
              base: "max-w-md",
              track: "drop-shadow-md border border-default",
              indicator: "bg-gradient-to-r from-yellow-500 to-pink-500",
              label: "tracking-wider font-bold text-xs",
              value: "text-foreground/60 text-xs",
            }}
            label="General Health"
            value={patient.progress.generalHealth}
            showValueLabel={true}
          />
          <Progress
            size="sm"
            radius="sm"
            color="secondary"
            classNames={{
              base: "max-w-md",
              track: "drop-shadow-md border border-default",

              label: "tracking-wider font-bold text-xs",
              value: "text-foreground/60 text-xs",
            }}
            label="Water Balance"
            value={patient.progress.waterBalance}
            showValueLabel={true}
          />
        </Card>
        <Card className="col-span-1 flex justify-center gap-5 items-center p-8 md:p-5">
          <Progress
            size="sm"
            radius="sm"
            color="success"
            classNames={{
              base: "max-w-md",
              track: "drop-shadow-md border border-default",
              label: "tracking-wider font-bold text-xs",
              value: "text-foreground/60 text-xs",
            }}
            label="Current Treatment"
            value={patient.progress.currentTreatment}
            showValueLabel={true}
          />
          <Progress
            size="sm"
            radius="sm"
            color="warning"
            classNames={{
              base: "max-w-md",
              track: "drop-shadow-md border border-default",
              label: "tracking-wider font-bold text-xs",
              value: "text-foreground/60 text-xs",
            }}
            label="Pending Appointments"
            formatOptions={{ style: "decimal" }}
            value={patient.progress.pendingAppointments}
            showValueLabel={true}
          />
        </Card>
        <Card className="h-screen md:h-auto row-span-5 col-span-2 flex flex-col gap-5 justify-center items-center p-5 w-full">
          <Calendar upcomingAppointments={upcomingAppointments} />
          <PatientTabs patient={patient} />
        </Card>
        <Card className="col-span-2 row-span-2 flex flex-col items-center">
          <p className="text-sm font-semibold self-start m-4 pt-2">Medicines</p>
          <MedicineDetails details={patient.medicines} />
        </Card>
        <Card className="h-56 md:h-auto row-span-2 col-span-3">
          <HealthConditions progressData={patient.healthConditions} />
        </Card>
      </div>
    </section>
  );
}
