import { useState } from "react";
import { Card, CardBody, Button, Chip } from "@nextui-org/react";
import { FaCalendarAlt, FaClock, FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface DateTimeSelectorProps {
  selectedDate: string;
  selectedTime: { startTime: string; endTime: string };
  onDateChange: (date: string) => void;
  onTimeChange: (time: { startTime: string; endTime: string }) => void;
}

export function DateTimeSelector({ 
  selectedDate, 
  selectedTime, 
  onDateChange, 
  onTimeChange 
}: DateTimeSelectorProps) {
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isPast = date < today;
      const isToday = date.toDateString() === today.toDateString();
      
      // Allow booking only for next 20 days from today
      const maxBookingDate = new Date(today);
      maxBookingDate.setDate(today.getDate() + 20);
      const isTooFar = date > maxBookingDate;
      
      days.push({
        date,
        isCurrentMonth,
        isPast,
        isToday,
        isTooFar,
        isSelectable: isCurrentMonth && !isPast && !isTooFar
      });
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newMonth);
  };

  // Time slots
  const timeSlots = [
    { label: "9:00 AM - 9:30 AM", start: "09:00", end: "09:30" },
    { label: "9:30 AM - 10:00 AM", start: "09:30", end: "10:00" },
    { label: "10:00 AM - 10:30 AM", start: "10:00", end: "10:30" },
    { label: "10:30 AM - 11:00 AM", start: "10:30", end: "11:00" },
    { label: "11:00 AM - 11:30 AM", start: "11:00", end: "11:30" },
    { label: "11:30 AM - 12:00 PM", start: "11:30", end: "12:00" },
    { label: "2:00 PM - 2:30 PM", start: "14:00", end: "14:30" },
    { label: "2:30 PM - 3:00 PM", start: "14:30", end: "15:00" },
    { label: "3:00 PM - 3:30 PM", start: "15:00", end: "15:30" },
    { label: "3:30 PM - 4:00 PM", start: "15:30", end: "16:00" },
    { label: "4:00 PM - 4:30 PM", start: "16:00", end: "16:30" },
    { label: "4:30 PM - 5:00 PM", start: "16:30", end: "17:00" },
  ];

  const calendarDays = generateCalendarDays();
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const handleDateSelect = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    onDateChange(dateStr);
  };

  const handleTimeSelect = (slot: typeof timeSlots[0]) => {
    setSelectedSlot(slot.label);
    onTimeChange({ startTime: slot.start, endTime: slot.end });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Left: Date Selection */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FaCalendarAlt className="text-blue-600 text-sm" />
          <h4 className="text-sm font-semibold text-gray-900">Select Date</h4>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 h-80">
          {/* Month Header */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => navigateMonth('prev')}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
            >
              <FaChevronLeft className="text-gray-600 text-sm" />
            </button>
            <h3 className="text-base font-semibold text-gray-900">
              {currentMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </h3>
            <button
              type="button"
              onClick={() => navigateMonth('next')}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
            >
              <FaChevronRight className="text-gray-600 text-sm" />
            </button>
          </div>
          
          {/* Week Days Header */}
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-gray-500 h-6 flex items-center justify-center">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const dateStr = day.date.toISOString().split('T')[0];
              const isSelected = selectedDate === dateStr;
              
              return (
                <button
                  type="button"
                  key={index}
                  onClick={() => day.isSelectable && handleDateSelect(day.date)}
                  disabled={!day.isSelectable}
                  className={`
                    h-8 w-8 text-sm rounded-md transition-colors flex items-center justify-center font-medium
                    ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm'
                        : day.isToday
                        ? 'bg-blue-100 text-blue-600 ring-1 ring-blue-300'
                        : day.isSelectable
                        ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                        : 'text-gray-300 cursor-not-allowed'
                    }
                  `}
                >
                  {day.date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Time Selection */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FaClock className="text-green-600 text-sm" />
          <h4 className="text-sm font-semibold text-gray-900">Select Time</h4>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 h-80">
          <div className="space-y-2 h-full overflow-y-auto">
            {timeSlots.map((slot) => {
              const isSelected = selectedSlot === slot.label;
              
              return (
                <button
                  type="button"
                  key={slot.label}
                  onClick={() => handleTimeSelect(slot)}
                  className={`
                    w-full h-8 text-sm font-medium rounded-md border transition-colors text-center
                    ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }
                  `}
                >
                  {slot.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Summary */}
      {selectedDate && selectedTime.startTime && (
        <div className="col-span-2 mt-2">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Selected Appointment</p>
            <div className="flex items-center gap-3">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                {selectedSlot}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}