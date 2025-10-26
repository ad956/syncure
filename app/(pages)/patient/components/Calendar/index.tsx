"use client";

import { format } from "date-fns";
import React from "react";
import { type DateFormatter, DayPicker } from "react-day-picker";
import { Card, useDisclosure } from "@nextui-org/react";
import { FaCalendarAlt } from "react-icons/fa";
import { getFormattedDate } from "@utils/get-date";
import AppointmentDetailsModal from "../AppointmentDetailsModal";

type upcomingAppointmentsType = {
  upcomingAppointments: Array<{
    _id: string;
    date: string;
    timing: {
      startTime: string;
      endTime: string;
    };
    state: string;
    city: string;
    hospital: {
      id: string;
      name: string;
    };
    disease: string;
    note: string;
    approved: string;
    patient_id: string;
    doctor_id: string;
    receptionist_id: string;
    doctor: {
      name: string;
      profile: string;
      specialty: string;
    };
    createdAt: string;
    updatedAt: string;
  }>;
};

export default function Calendar({
  upcomingAppointments,
}: upcomingAppointmentsType) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [appointmentDetail, setappointmentDetail] = React.useState<{
    _id: string;
    date: string;
    timing: {
      startTime: string;
      endTime: string;
    };
    state: string;
    city: string;
    hospital: {
      id: string;
      name: string;
    };
    disease: string;
    note: string;
    approved: string;
    patient_id: string;
    doctor_id: string;
    receptionist_id: string;
    doctor: {
      name: string;
      profile: string;
      specialty: string;
    };
    createdAt: string;
    updatedAt: string;
  } | null>(null);

  const [appointmentDates, setAppointmentDates] = React.useState<Date[]>([]);

  React.useEffect(() => {
    console.log("Calendar received appointments:", upcomingAppointments);
    if (upcomingAppointments && upcomingAppointments.length > 0) {
      const selectedDates = upcomingAppointments.map((appointment) => {
        const date = new Date(appointment.date);
        // Normalize to midnight to avoid timezone issues
        const normalizedDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        );
        console.log(
          "Processing appointment date:",
          appointment.date,
          "Normalized:",
          normalizedDate
        );
        return normalizedDate;
      });
      console.log("Setting appointment dates:", selectedDates);
      console.log("appointmentDates array contents:", selectedDates.map(d => ({
        date: d,
        day: d.getDate(),
        month: d.getMonth(),
        year: d.getFullYear()
      })));
      setAppointmentDates(selectedDates);
    } else {
      setAppointmentDates([]);
    }
  }, [upcomingAppointments]);

  const seasonEmoji: Record<string, string> = {
    winter: "⛄️",
    spring: "🌸",
    summer: "🌻",
    autumn: "🍂",
  };

  const getSeason = (month: Date): string => {
    const monthNumber = month.getMonth();
    if (monthNumber >= 0 && monthNumber < 3) return "winter";
    if (monthNumber >= 3 && monthNumber < 6) return "spring";
    if (monthNumber >= 6 && monthNumber < 9) return "summer";
    return "autumn";
  };

  const formatCaption: DateFormatter = (month, options) => {
    const season = getSeason(month);
    return (
      <>
        <span role="img" aria-label={season}>
          {seasonEmoji[season]}
        </span>{" "}
        {format(month, "LLLL", { locale: options?.locale })}
      </>
    );
  };

  function handleDayClick(day: Date): void {
    const dayString = getFormattedDate(day);

    const selectedAppointment = upcomingAppointments?.find(
      (appointment) =>
        getFormattedDate(new Date(appointment.date)) === dayString
    );
    if (selectedAppointment) {
      setappointmentDetail(selectedAppointment);
      onOpen();
    } else {
      setappointmentDetail(null);
    }
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Perfectly centered calendar */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-[320px]">
          <DayPicker
          key={appointmentDates.map(d => d.toISOString()).join('-')}
          mode="multiple"
          selected={appointmentDates}
          defaultMonth={appointmentDates[0] ?? new Date()}
          showOutsideDays
          onDayClick={handleDayClick}
          classNames={{
            root: "text-sm",
            months: "flex flex-col",
            month: "space-y-1",
            caption: "flex justify-center py-1 relative items-center text-sm font-semibold text-gray-800 mb-1",
            caption_label: "text-sm font-semibold",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-white border border-gray-200 p-0 hover:bg-gray-50 rounded-md shadow-sm transition-all duration-200",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex mb-1",
            head_cell: "text-gray-500 w-8 h-6 font-semibold text-xs flex items-center justify-center",
            row: "flex w-full gap-0.5 mt-0.5",
            cell: "text-center relative",
            day: "h-8 w-8 p-0 font-medium hover:bg-blue-50 hover:text-blue-700 hover:scale-105 rounded-lg transition-all duration-200 flex items-center justify-center text-xs border border-transparent hover:border-blue-200",
            day_selected: "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white rounded-lg font-bold shadow-md border border-blue-400 transform scale-105",
            day_today: "bg-gray-100 text-gray-900 font-semibold border border-gray-300 rounded-lg",
            day_outside: "text-gray-300 opacity-60",
            day_disabled: "text-gray-300 opacity-40",
            day_hidden: "invisible",
          }}
          formatters={{ formatCaption }}
          />
        </div>
      </div>
      
      {/* Appointment indicator */}
      <div className="flex justify-center mt-2">
        <div className="flex items-center gap-2">
          {appointmentDates.length > 0 ? (
            <div className="flex items-center gap-1">
              {appointmentDates.map((_, index) => (
                <div key={index} className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              ))}
              <span className="text-xs text-gray-600 ml-1">
                {appointmentDates.length} appointment{appointmentDates.length > 1 ? 's' : ''}
              </span>
            </div>
          ) : (
            <div className="text-xs text-gray-400">No appointments scheduled</div>
          )}
        </div>
      </div>

      <AppointmentDetailsModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        appointmentDetail={appointmentDetail}
      />
    </div>
  );
}
