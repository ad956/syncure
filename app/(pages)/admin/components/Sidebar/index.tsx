"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Image, Spacer } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { FiHome, FiUserPlus, FiSettings, FiHeart } from "react-icons/fi";
import { TbCurrencyRupee } from "react-icons/tb";

// Sidebar configuration
const SidebarConfig = [
  { title: "Dashboard", uri: "", icon: <FiHome /> },
  { title: "Add Admin", uri: "add-admin", icon: <FiUserPlus /> },
  { title: "Transactions", uri: "transactions", icon: <TbCurrencyRupee /> },
  { title: "Hospitals", uri: "hospitals", icon: <FiHeart /> },
  { title: "Settings", uri: "settings", icon: <FiSettings /> },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [selected, setSelected] = useState<number>(
    getInitialSelectedIndex(pathname)
  );

  function getInitialSelectedIndex(pathname: string): number {
    const index = SidebarConfig.findIndex(
      (item) => `/admin/${item.uri}` === pathname
    );
    return index !== -1 ? index : 0;
  }

  function handleButtonClick(index: number): void {
    setSelected(index);
  }

  return (
    <aside className="h-screen flex-col border-r bg-white w-16 shadow-sm">
      <nav className="flex flex-col items-center gap-6 px-2 py-5">
        <Image
          src="/icons/patient.svg"
          className="mt-1"
          height={35}
          width={35}
          alt="Syncure"
        />
        <Spacer y={5} />
        {SidebarConfig.map((item, index) => (
          <SidebarIcon
            key={item.title}
            icon={item.icon}
            href={`/admin/${item.uri}`}
            isActive={selected === index}
            onClick={() => handleButtonClick(index)}
          />
        ))}
      </nav>
    </aside>
  );
};

const SidebarIcon = ({ icon, isActive = false, href = "#", onClick }: any) => (
  <Link
    href={href}
    onClick={onClick}
    className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200 ${
      isActive
        ? "bg-warning-100 text-warning-600"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`}
  >
    {React.cloneElement(icon, { className: "h-5 w-5 stroke-[1.5]" })}
  </Link>
);

export default Sidebar;
