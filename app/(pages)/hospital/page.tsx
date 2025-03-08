import getHospitalData from "@lib/hospital/get-hospital-data";
import getHospitalDetails from "@lib/hospital/get-hospital-details";
import { Avatar, Card, Divider, Progress } from "@nextui-org/react";
import { CiHospital1 } from "react-icons/ci";
import {
  LuUsers,
  LuUserCircle,
  LuActivity,
  LuClock,
  LuHeart,
  LuWallet,
} from "react-icons/lu";
import { ResponsiveLine } from "@nivo/line";
import Dashboard from "./components/Dashboard";

export default async function Hospital() {
  const hospital = await getHospitalData();
  const hospitalDetails = await getHospitalDetails();

  return (
    <section className="bg-[#f3f6fd] p-5 overflow-y-scroll scrollbar h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 h-full">
        {/* Profile Card */}
        <Card className="p-5 flex flex-col justify-center items-center col-span-1 md:col-span-1 lg:col-span-1">
          <div className="flex flex-col items-center">
            <Avatar
              size="lg"
              src={hospital.profile}
              icon={<CiHospital1 size={24} />}
            />
            <p className="text-sm font-semibold">{hospital.firstname}</p>
            <p className="text-tiny text-gray-700">+{hospital.contact}</p>
          </div>

          <div className="p-5 w-full text-sm font-semibold m-2 text-black/75 flex flex-col gap-2">
            <p className="self-center">Hospital Details</p>
            <Divider className="mx-2 w-full bg-black/10" />
            <div className="mt-5 flex flex-row justify-between">
              <div className="flex flex-col gap-2">
                <p>Total Beds:</p>
                <p>Doctors:</p>
                <p>Staff:</p>
                <p>Departments:</p>
              </div>
              <div className="flex flex-col items-end gap-2 font-bold text-black">
                <p>{hospitalDetails.hospitalStatus.availableBeds}</p>
                <p>{hospitalDetails.hospitalStatus.totalDoctors}</p>
                <p>{hospitalDetails.hospitalStatus.totalStaff}</p>
                <p>{hospitalDetails.additionalInfo.servicesOffered.length}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Progress & Emergency Department Status */}
        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Progress Cards */}
          <Card className="p-8 flex justify-center gap-5 items-center col-span-1 md:col-span-2">
            <Progress
              size="sm"
              radius="sm"
              classNames={{
                base: "max-w-md",
                track: "drop-shadow-md border border-default",
                indicator: "bg-gradient-to-r from-blue-500 to-purple-500",
                label: "tracking-wider font-bold text-xs",
                value: "text-foreground/60 text-xs",
              }}
              label="Occupancy Rate"
              value={
                (hospitalDetails.hospitalStatus.totalPatients / 1000) * 100
              }
              showValueLabel={true}
            />
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
              label="Patient Satisfaction"
              value={85}
              showValueLabel={true}
            />
          </Card>

          <Card className="p-8 flex justify-center gap-5 items-center col-span-1 md:col-span-2">
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
              label="Emergency Response"
              value={90}
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
              label="Revenue Target"
              value={75}
              showValueLabel={true}
            />
          </Card>

          {/* Emergency Department Cards */}
          <Card className="p-5 flex flex-col col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold">
              Emergency Department Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <Card className="p-4 flex flex-col items-center">
                <LuUserCircle className="mb-2" />
                <p className="text-sm font-semibold">Current Patients</p>
                <p className="text-2xl font-bold">
                  {hospitalDetails.hospitalStatus.emergencyCases}
                </p>
              </Card>
              <Card className="p-4 flex flex-col items-center">
                <LuClock className="mb-2" />
                <p className="text-sm font-semibold">Avg Wait Time</p>
                <p className="text-2xl font-bold">20 mins</p>
              </Card>
              <Card className="p-4 flex flex-col items-center">
                <LuActivity className="mb-2" />
                <p className="text-sm font-semibold">Critical Cases</p>
                <p className="text-2xl font-bold">
                  {hospitalDetails.hospitalStatus.emergencyCases}
                </p>
              </Card>
              <Card className="p-4 flex flex-col items-center">
                <LuHeart className="mb-2" />
                <p className="text-sm font-semibold">Available Beds</p>
                <p className="text-2xl font-bold">
                  {hospitalDetails.hospitalStatus.availableBeds}
                </p>
              </Card>
            </div>
          </Card>
        </div>

        {/* Dashboard Section */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-10">
          <Dashboard />
        </div>
      </div>
    </section>
  );
}
