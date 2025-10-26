"use client";

import React, { useState } from "react";
import { Tabs, Tab, Card } from "@nextui-org/react";
import { Toaster } from "react-hot-toast";
import { IoFlaskOutline } from "react-icons/io5";
import { RiStethoscopeLine } from "react-icons/ri";
import { MdReceiptLong } from "react-icons/md";

import PendingBills from "./PendingBills";
import LabResults from "./LabResults";

interface PatientTabsProps {
  patient: Patient;
}

export default function PatientTabs({ patient }: PatientTabsProps) {
  const [selectedTab, setSelectedTab] = useState<string>("bills");

  const patientInfo = {
    name: `${patient.firstname} ${patient.lastname}`,
    email: patient.email,
    contact: patient.contact,
  };

  const handleTabChange = (key: React.Key) => {
    setSelectedTab(key as string);
  };

  return (
    <div className="w-full">
      <Tabs
        aria-label="Patient Services"
        color="primary"
        variant="underlined"
        selectedKey={selectedTab}
        onSelectionChange={handleTabChange}
        size="sm"
        classNames={{
          tabList: "gap-4 w-full relative rounded-none p-0 border-b border-gray-200",
          cursor: "w-full bg-blue-600 h-0.5",
          tab: "max-w-fit px-0 h-10",
          tabContent: "group-data-[selected=true]:text-blue-600 text-gray-500 text-sm",
        }}
      >
        <Tab
          key="bills"
          title={
            <div className="flex items-center gap-2">
              <MdReceiptLong className="w-4 h-4" />
              <span className="text-sm">Bills</span>
            </div>
          }
        >
          <div className="pt-4">
            <PendingBills patient={patientInfo} />
          </div>
        </Tab>

        <Tab
          key="lab"
          title={
            <div className="flex items-center gap-2">
              <IoFlaskOutline className="w-4 h-4" />
              <span className="text-sm">Lab Results</span>
            </div>
          }
        >
          <div className="pt-4">
            <LabResults />
          </div>
        </Tab>
      </Tabs>
      <Toaster />
    </div>
  );
}
