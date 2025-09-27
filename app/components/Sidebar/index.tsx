"use client";

import React from "react";
import { Button, Image } from "@nextui-org/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { IoQrCodeOutline, IoSettingsOutline } from "react-icons/io5";
import {
  MdOutlineCurrencyRupee,
  MdOutlineSpaceDashboard,
} from "react-icons/md";
import { AiOutlineSchedule } from "react-icons/ai";
import { CiHospital1 } from "react-icons/ci";
import { FaHospital } from "react-icons/fa";
import { IconType } from "react-icons";
import { LiaUserNurseSolid, LiaUserSolid } from "react-icons/lia";
import { BsChatDots } from "react-icons/bs";
import BaseUrl from "@utils/base-url";

// Define icon mapping
const iconMapping: Record<string, IconType> = {
  dashboard: MdOutlineSpaceDashboard,
  qrcode: IoQrCodeOutline,
  appointments: AiOutlineSchedule,
  chat: BsChatDots,
  payments: MdOutlineCurrencyRupee,
  medicalHistory: CiHospital1,
  settings: IoSettingsOutline,
  doctors: LiaUserNurseSolid,
  patients: LiaUserSolid,
  info: CiHospital1,
  hospitals: FaHospital,
};

interface SidebarItem {
  title: string;
  uri: string;
  icon: string;
}

interface SidebarProps {
  userType: string;
}

export default function Sidebar({ userType }: SidebarProps) {
  const pathname = usePathname();

  const sidebarConfig: SidebarItem[] = getSidebarConfig(userType);

  const [selected, setSelected] = useState<number>(
    getInitialSelectedIndex(pathname)
  );

  function getInitialSelectedIndex(pathname: string): number {
    const index = sidebarConfig.findIndex(
      (item) => `/${userType}/${item.uri}` === pathname
    );
    return index !== -1 ? index : 0;
  }

  function handleButtonClick(index: number): void {
    setSelected(index);
  }

  return (
    <aside className="h-full md:flex flex-col items-center p-4 bg-[#f3f6fd]">
      <Image
        src={"/icons/patient.svg"}
        alt="user-type-logo"
        height={35}
        width={35}
        className="my-1"
      />
      <div className="flex flex-col justify-center gap-5 items-center my-20">
        {sidebarConfig.map((item, index) => (
          <Button
            key={item.title}
            href={`${BaseUrl}/${userType}/${item.uri}`}
            isIconOnly
            as={Link}
            radius="full"
            variant="shadow"
            className={`${
              selected === index ? "bg-[#1f1c2e] text-white" : "bg-gray-100"
            }`}
            onClick={() => handleButtonClick(index)}
          >
            {React.createElement(
              iconMapping[item.icon] || MdOutlineSpaceDashboard,
              { size: 22 }
            )}
          </Button>
        ))}
      </div>
    </aside>
  );
}

function getSidebarConfig(userType: string) {
  switch (userType) {
    case "patient":
      return patientSidebarConfig;
    case "receptionist":
      return receptionistSidebarConfig;
    case "doctor":
      return doctorSidebarConfig;
    default:
      return hospitalSidebarConfig;
  }
}

const patientSidebarConfig: SidebarItem[] = [
  { title: "Dashboard", uri: "", icon: "dashboard" },
  { title: "QR Code", uri: "qrcode", icon: "qrcode" },
  { title: "Appointments", uri: "appointments", icon: "appointments" },
  { title: "Chat", uri: "chat", icon: "chat" },
  { title: "Payments", uri: "paymenthistory", icon: "payments" },
  { title: "Medical History", uri: "medicalhistory", icon: "medicalHistory" },
  { title: "Settings", uri: "settings", icon: "settings" },
];

const receptionistSidebarConfig: SidebarItem[] = [
  { title: "Dashboard", uri: "", icon: "dashboard" },
  { title: "QR Code", uri: "qrscanner", icon: "qrcode" },
  { title: "Appointments", uri: "appointments", icon: "appointments" },
  { title: "Patients", uri: "patients", icon: "patients" },
  { title: "Doctors", uri: "doctors", icon: "doctors" },
  { title: "Settings", uri: "settings", icon: "settings" },
];

const doctorSidebarConfig: SidebarItem[] = [
  { title: "Dashboard", uri: "", icon: "dashboard" },
  { title: "Appointments", uri: "appointments", icon: "appointments" },
  { title: "Chat", uri: "chat", icon: "chat" },
  { title: "Patients", uri: "patients", icon: "patients" },
  { title: "Medical Records", uri: "records", icon: "medicalHistory" },
  { title: "Settings", uri: "settings", icon: "settings" },
];

const hospitalSidebarConfig: SidebarItem[] = [
  { title: "Dashboard", uri: "", icon: "dashboard" },
  { title: "Appointments", uri: "appointments", icon: "appointments" },
  { title: "Patients", uri: "patients", icon: "patients" },
  { title: "Doctors", uri: "doctors", icon: "doctors" },
  { title: "Payments", uri: "payments", icon: "payments" },
  { title: "info", uri: "additional-information", icon: "info" },
  { title: "Settings", uri: "settings", icon: "settings" },
];
