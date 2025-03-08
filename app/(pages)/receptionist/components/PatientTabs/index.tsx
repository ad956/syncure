"use client";

import React, { useState } from "react";
import { GiLotus } from "react-icons/gi";
import {
  Button,
  Listbox,
  ListboxItem,
  Tabs,
  Tab,
  Chip,
  Avatar,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { getFormattedDate } from "@utils/get-date";
import approveAppointment from "@lib/receptionist/approve-appointment";
import toast, { Toaster } from "react-hot-toast";

interface PatientTabsProps {
  pendingAppointments: { patientDetails: PatientDetails[] };
}

export default function PatientTabs({ pendingAppointments }: PatientTabsProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedPatient, setSelectedPatient] = useState<PatientDetails | null>(
    null
  );

  const tabsData = [
    {
      key: "patient-pending",
      title: "Pending Patients",
      count: pendingAppointments.patientDetails.length,
    },
    {
      key: "approved",
      title: "Approved Patients",
      count: pendingAppointments.patientDetails.length,
    },
    {
      key: "patient-waiting",
      title: "Waiting Patients",
      count: pendingAppointments.patientDetails.length,
    },
  ];

  async function handleApproveButton(): Promise<void> {
    try {
      const response = await approveAppointment(selectedPatient?._id ?? "");

      if (response) {
        toast.success("Appointment approved successfully");
      }
    } catch (error) {
      console.error("Error approving appointment:", error);
    }
  }

  return (
    <div className="flex h-full w-full flex-col">
      <Tabs aria-label="patients-tabs" variant="bordered" color="danger">
        {tabsData.map((item) => (
          <Tab
            key={item.key}
            title={
              <div className="flex items-center space-x-2">
                <GiLotus />
                <span className="text-xs">{item.title}</span>
                <Chip size="sm" variant="flat">
                  {item.count}
                </Chip>
              </div>
            }
          >
            <Listbox
              aria-label="Patient List"
              classNames={{
                list: "max-h-[500px] overflow-y-scroll scrollbar",
              }}
              items={pendingAppointments.patientDetails}
              variant="shadow"
            >
              {(patient) => (
                <ListboxItem
                  key={patient._id}
                  textValue={`${patient.firstname} ${patient.lastname}`}
                  onPress={() => {
                    onOpen();
                    setSelectedPatient(patient);
                  }}
                >
                  <div className="flex gap-2 items-center">
                    <Avatar
                      alt={`${patient.firstname} ${patient.lastname}`}
                      className="flex-shrink-0"
                      size="sm"
                      src={patient.profile}
                    />
                    <div className="flex flex-col">
                      <span className="text-small">{`${patient.firstname} ${patient.lastname}`}</span>
                      <span className="text-tiny text-default-400">
                        {patient.email}
                      </span>
                    </div>
                  </div>
                </ListboxItem>
              )}
            </Listbox>
          </Tab>
        ))}
      </Tabs>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selectedPatient &&
                  `${selectedPatient.firstname} ${selectedPatient.lastname}`}{" "}
                Details
              </ModalHeader>
              <ModalBody>
                {selectedPatient && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center space-x-4 mb-4">
                        <Avatar
                          alt={`${selectedPatient.firstname} ${selectedPatient.lastname}`}
                          src={selectedPatient.profile}
                          size="lg"
                        />
                        <div>
                          <p className="text-sm font-semibold">
                            {selectedPatient.firstname}{" "}
                            {selectedPatient.lastname}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p>
                          <span className="font-semibold">Date of Birth:</span>{" "}
                          {selectedPatient.dob}
                        </p>
                        <p>
                          <span className="font-semibold">Gender:</span>{" "}
                          {selectedPatient.gender}
                        </p>
                        <p>
                          <span className="font-semibold">Contact:</span>{" "}
                          {selectedPatient.contact}
                        </p>
                        <p>
                          <span className="font-semibold">Address:</span>{" "}
                          {selectedPatient.address.address_line_1},{" "}
                          {selectedPatient.address.address_line_2},{" "}
                          {selectedPatient.address.city},{" "}
                          {selectedPatient.address.state},{" "}
                          {selectedPatient.address.country} -{" "}
                          {selectedPatient.address.zip_code}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p>
                        <span className="font-semibold">Disease:</span>{" "}
                        {selectedPatient.disease}
                      </p>
                      <p>
                        <span className="font-semibold">Note:</span>{" "}
                        {selectedPatient.note}
                      </p>
                      <p>
                        <span className="font-semibold">Date:</span>{" "}
                        {getFormattedDate(new Date(selectedPatient.date))}
                      </p>
                      <p>
                        <span className="font-semibold">Timing:</span>{" "}
                        {selectedPatient.timing}
                      </p>
                    </div>
                  </div>
                )}
              </ModalBody>

              <ModalFooter>
                <Button
                  color="secondary"
                  variant="light"
                  onClick={handleApproveButton}
                >
                  Approve
                </Button>
                <Button color="danger" variant="light" onPress={onClose}>
                  Reject
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Toaster />
    </div>
  );
}
