import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Avatar,
  Chip,
} from "@nextui-org/react";
import { LuCalendarClock, LuMapPin, LuStethoscope } from "react-icons/lu";
import { getFormattedDate } from "@utils/get-date";

const AppointmentDetailsModal = ({
  isOpen,
  onOpenChange,
  appointmentDetail,
}: any) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalContent className="bg-white">
        <>
          <ModalHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <LuCalendarClock className="text-indigo-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Appointment Details</h3>
            </div>
          </ModalHeader>
          <ModalBody className="p-6">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-4">
                <Avatar
                  src={appointmentDetail?.doctor.profile}
                  className="w-16 h-16 border-2 border-white shadow-md"
                />
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {appointmentDetail?.doctor.name}
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    <LuStethoscope className="text-indigo-600 text-sm" />
                    <span className="text-sm text-gray-600">
                      {appointmentDetail?.doctor.specialty}
                    </span>
                  </div>
                  <Chip size="sm" color="success" variant="flat">
                    Confirmed
                  </Chip>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <LuCalendarClock className="text-indigo-600 text-lg" />
                <div>
                  <p className="font-medium text-gray-900">
                    {appointmentDetail &&
                      getFormattedDate(new Date(appointmentDetail.createdAt))}
                  </p>
                  <p className="text-sm text-gray-600">
                    {appointmentDetail?.timing.startTime} - {appointmentDetail?.timing.endTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-lg">
                <LuStethoscope className="text-red-500 text-lg mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Condition</p>
                  <p className="text-gray-900">{appointmentDetail?.disease}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-lg">
                <LuMapPin className="text-blue-500 text-lg mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Hospital</p>
                  <p className="text-gray-900">{appointmentDetail?.hospital.name}</p>
                  <p className="text-sm text-gray-600">{appointmentDetail?.city}</p>
                </div>
              </div>
              
              {appointmentDetail?.note && (
                <div className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-lg">
                  <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Additional Notes</p>
                    <p className="text-gray-900">{appointmentDetail?.note}</p>
                  </div>
                </div>
              )}
            </div>
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
};

export default AppointmentDetailsModal;
