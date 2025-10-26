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
    <aside className="h-full w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6 shadow-sm">
      {/* Logo */}
      <div className="mb-8">
        <Image
          src={"/icons/patient.svg"}
          alt="user-type-logo"
          height={32}
          width={32}
        />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3 flex-1">
        {sidebarConfig.map((item, index) => {
          const IconComponent = iconMapping[item.icon] || MdOutlineSpaceDashboard;
          const isActive = selected === index;
          
          return (
            <div key={item.title} className="relative group">
              <Button
                href={`${BaseUrl}/${userType}/${item.uri}`}
                isIconOnly
                as={Link}
                className={`w-10 h-10 min-w-10 rounded-xl transition-all duration-300 relative p-0 shadow-sm ${
                  isActive 
                    ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-md" 
                    : "bg-white/70 text-gray-500 hover:bg-white hover:text-gray-700 hover:shadow-md"
                }`}
                onClick={() => handleButtonClick(index)}
              >
                <IconComponent size={20} className={`transition-transform duration-200 ${
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                }`} />
              </Button>
              
              {/* Tooltip */}
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.title}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            </div>
          );
        })}
      </nav>
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
