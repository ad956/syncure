export const dynamic = 'force-dynamic';

import getPatientData from "@lib/patient/get-patient-data";
import { Card, Link, User } from "@nextui-org/react";
import QRCode from "../components/QR";
import { getSession } from "@lib/auth/get-session";
import { redirect } from "next/navigation";

export default async function QRCodePage() {
  const session = await getSession();
  
  if (!session?.user?.id) {
    redirect('/login');
  }
  
  const patient = await getPatientData(session.user.id);

  return (
    <Card
      shadow="lg"
      className="h-full flex flex-row justify-around items-center"
    >
      <div className="md:h-4/5 md:w-2/6 flex flex-col justify-center gap-5 items-center">
        <User
          name={patient.firstname}
          description={
            <Link size="sm" isExternal>
              @{patient.username}
            </Link>
          }
          avatarProps={{
            src: `${patient.profile}`,
          }}
        />

        <div className="flex flex-col justify-center items-center gap-2 px-5">
          <p className="text-sm font-semibold">
            Quick Patient Verification via QR Code
          </p>
          <p className="text-xs text-center">
            Receptionists can scan this code to verify your identity instantly
            and access your medical records for a smoother check-in process.
          </p>
        </div>

        <QRCode text={patient.email} />
      </div>
    </Card>
  );
}
