"use client";

import { useState, useEffect } from "react";
import {
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Button,
  Pagination,
} from "@nextui-org/react";

interface Appointment {
  _id: string;
  date: string;
  hospital: { name: string; profile?: string };
  disease: string;
  approved: 'pending' | 'approved' | 'rejected';
  appointment_status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  assigned_doctor?: {
    _id: string;
    firstname: string;
    lastname: string;
    profile?: string;
    specialty?: string;
  };
  timing?: { startTime: string; endTime: string };
  note?: string;
  booked_for?: {
    type: "self" | "family";
    patient_name?: string;
    patient_relation?: string;
  };
  state?: string;
  city?: string;
}

const formatTime = (time: string) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
};

export function PendingAppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchPendingAppointments();
  }, []);

  const fetchPendingAppointments = async () => {
    try {
      const response = await fetch(
        "/api/patient/appointments?status=pending"
      );
      const data = await response.json();
      if (data.success) {
        const appointments = data.data?.appointments || [];
        console.log(appointments);
        setAppointments(appointments);
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3 min-h-[200px]">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm"
          >
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded-full w-16"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8 min-h-[200px] flex flex-col justify-center">
        <div className="w-12 h-12 mx-auto mb-3 bg-blue-50 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-gray-600 text-sm font-medium">
          No pending appointments
        </p>
        <p className="text-gray-500 text-xs mt-1">
          Your appointments will appear here
        </p>
      </div>
    );
  }

  const fetchAllAppointments = async () => {
    setModalLoading(true);
    try {
      const response = await fetch("/api/patient/appointments?status=pending");
      const data = await response.json();
      if (data.success) {
        const appointments = data.data?.appointments || [];
        console.log("All appointments:", appointments.length);
        setAllAppointments(appointments);
      }
    } catch (error) {
      console.error("Failed to fetch all appointments:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleViewAll = () => {
    fetchAllAppointments();
    onOpen();
  };

  return (
    <>
      <div className="space-y-3 min-h-[200px]">
        {appointments.slice(0, 3).map((appointment) => (
          <div
            key={appointment._id}
            className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <img
                  src={appointment.hospital.profile || `https://ui-avatars.com/api/?name=${encodeURIComponent(appointment.hospital.name)}&background=3b82f6&color=ffffff&size=40&rounded=true&bold=true`}
                  alt={appointment.hospital.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {appointment.hospital.name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {appointment.city}, {appointment.state}
                  </p>
                  {appointment.assigned_doctor && (
                    <p className="text-xs text-blue-600 font-medium">
                      Dr. {appointment.assigned_doctor.firstname} {appointment.assigned_doctor.lastname}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Chip 
                  size="sm" 
                  color={appointment.approved === 'approved' ? 'success' : appointment.approved === 'rejected' ? 'danger' : 'warning'} 
                  variant="flat" 
                  className="text-xs"
                >
                  {appointment.approved}
                </Chip>
                {appointment.assigned_doctor && (
                  <Chip size="sm" color="primary" variant="flat" className="text-xs">
                    Doctor Assigned
                  </Chip>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs text-gray-500">Condition</p>
                <p className="font-medium text-gray-900 text-sm">{appointment.disease}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Patient</p>
                <p className="font-medium text-gray-900 text-sm">
                  {appointment.booked_for?.type === 'family' ? appointment.booked_for.patient_name : 'Myself'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="text-gray-500">Date: </span>
                <span className="font-medium text-gray-900">
                  {new Date(appointment.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              {appointment.timing && (
                <div>
                  <span className="text-gray-500">Time: </span>
                  <span className="font-medium text-gray-900">
                    {formatTime(appointment.timing.startTime)}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {appointments.length > 3 && (
          <Button
            size="sm"
            variant="light"
            className="w-full text-blue-600 hover:text-blue-700"
            onPress={handleViewAll}
          >
            View All ({appointments.length} total)
          </Button>
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="3xl"
        scrollBehavior="inside"
        classNames={{
          base: "bg-white",
          backdrop: "bg-black/40",
        }}
      >
        <ModalContent className="bg-white rounded-lg">
          <ModalHeader className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  All Pending Appointments
                </h3>
                <p className="text-gray-500 text-sm">
                  {allAppointments.length} appointment{allAppointments.length !== 1 ? 's' : ''} awaiting confirmation
                </p>
              </div>
              <Chip size="sm" color="warning" variant="flat">
                Under Review
              </Chip>
            </div>
          </ModalHeader>
          <ModalBody className="p-4">
            {modalLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-gray-100 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 pr-2">
                  {paginationLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="animate-pulse bg-gray-100 rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    allAppointments
                      .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )
                      .map((appointment) => (
                      <div
                        key={appointment._id}
                        className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <img
                              src={appointment.hospital.profile || `https://ui-avatars.com/api/?name=${encodeURIComponent(appointment.hospital.name)}&background=3b82f6&color=ffffff&size=40&rounded=true&bold=true`}
                              alt={appointment.hospital.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <h4 className="font-semibold text-gray-900 text-sm">
                                {appointment.hospital.name}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {appointment.city}, {appointment.state}
                              </p>
                            </div>
                          </div>
                          <Chip size="sm" color="warning" variant="flat" className="text-xs">
                            {appointment.approved}
                          </Chip>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-3 text-xs">
                          <div>
                            <p className="text-gray-500">Condition</p>
                            <p className="font-medium text-gray-900">{appointment.disease}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Patient</p>
                            <p className="font-medium text-gray-900">
                              {appointment.booked_for?.type === 'family' 
                                ? appointment.booked_for.patient_name
                                : 'Myself'
                              }
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Date</p>
                            <p className="font-medium text-gray-900">
                              {new Date(appointment.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Time</p>
                            <p className="font-medium text-gray-900">
                              {appointment.timing
                                ? formatTime(appointment.timing.startTime)
                                : "TBD"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {allAppointments.length > itemsPerPage && (
                  <div className="bg-gray-50 -mx-4 -mb-4 px-4 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, allAppointments.length)} of {allAppointments.length}
                    </div>
                    <Pagination
                      total={Math.ceil(allAppointments.length / itemsPerPage)}
                      page={currentPage}
                      onChange={(page) => {
                        setPaginationLoading(true);
                        setCurrentPage(page);
                        setTimeout(() => setPaginationLoading(false), 300);
                      }}
                      showControls
                      size="sm"
                      color="primary"
                      variant="flat"
                      isDisabled={paginationLoading}
                      classNames={{
                        wrapper: "gap-1",
                        item: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
                        cursor: "bg-blue-600 text-white border-blue-600",
                        prev: "bg-white border border-gray-300 hover:bg-gray-50",
                        next: "bg-white border border-gray-300 hover:bg-gray-50",
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}