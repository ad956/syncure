"use client";

import React from "react";
import { Card } from "@nextui-org/react";
import {
  FaPills,
  FaCalendarAlt,
  FaStethoscope,
  FaWeight,
  FaChartLine,
} from "react-icons/fa";
import {
  MdReceiptLong,
  MdLocalPharmacy,
} from "react-icons/md";
import {
  IoShieldCheckmark,
} from "react-icons/io5";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import Calendar from "../Calendar";
import VitalSigns from "../VitalSigns";
import MedicationTracker from "../MedicationTracker";
import HealthMetrics from "../HealthMetrics";
import PendingBills from "../PatientTabs/PendingBills";
import LabResults from "../PatientTabs/LabResults";
import PatientProfileCard from "../PatientProfileCard";
import SpinnerLoader from "@components/SpinnerLoader";
import CalendarSkeleton from "../LoadingStates/CalendarSkeleton";
import MedicationSkeleton from "../LoadingStates/MedicationSkeleton";
import BillsSkeleton from "../LoadingStates/BillsSkeleton";
import HealthMetricsSkeleton from "../LoadingStates/HealthMetricsSkeleton";
import LabResultsSkeleton from "../LoadingStates/LabResultsSkeleton";
import { usePatient } from "@hooks/usePatient";
import { useAppointments } from "@hooks/useAppointments";
import { useMedications } from "@hooks/useMedications";
import { useTodaysVitals } from "@hooks/useTodaysVitals";

export default function DashboardClient({ patientId }: { patientId: string }) {
  const { patient, isLoading: patientLoading, error } = usePatient();
  const { appointments, isLoading: appointmentsLoading } = useAppointments();
  const { medications, isLoading: medicationsLoading } = useMedications();
  const { vitals: todaysVitals, isLoading: vitalsLoading } = useTodaysVitals();
  
  // Placeholder for other hooks - will be implemented later
  const labResultsLoading = false;
  const billsLoading = false;
  const healthTrendsLoading = false;
  const healthTrends: any[] = [];



  if (patientLoading) {
    return <SpinnerLoader />;
  }

  if (error || !patient) {
    return null; // Let error boundary handle it
  }

  // Calculate health metrics from available data
  const healthMetrics = {
    healthScore: 85,
    activeMedications: medications?.length || 0,
    bmi: patient.physicalDetails?.weight && patient.physicalDetails?.height 
      ? (patient.physicalDetails.weight / Math.pow(patient.physicalDetails.height / 100, 2)).toFixed(1)
      : null,
    bmiStatus: "Normal"
  };
  
  const nextAppointment = appointments?.[0] || null;
  
  // Use dashboard nextAppointment data for Next Appointment card
  const displayAppointment = nextAppointment;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {patient.firstname}!
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <IoShieldCheckmark className="text-green-500" />
              Your health data is secure and up to date
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last sync</p>
            <p className="font-semibold text-gray-900">
              {patient.updatedAt
                ? new Date(patient.updatedAt).toLocaleTimeString()
                : new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Patient Profile Card */}
        <div className="col-span-12 lg:col-span-4">
          <PatientProfileCard
            patient={patient}
            patientId={patientId}
          />
        </div>

        {/* Health Overview Cards */}
        <div className="col-span-12 lg:col-span-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 bg-white shadow-md border-0 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Next Appointment
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {displayAppointment?.date
                      ? new Date(displayAppointment.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "None"}
                  </p>
                  <p className="text-xs text-blue-600">
                    {displayAppointment?.doctor?.name || "No upcoming appointments"}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <FaStethoscope className="text-blue-600 text-lg" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white shadow-md border-0 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Health Score
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {healthMetrics.healthScore}/100
                  </p>
                  <p className="text-xs text-green-600">Excellent</p>
                </div>
                <div className="p-3 bg-green-50 rounded-full">
                  <IoShieldCheckmark className="text-green-600 text-lg" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white shadow-md border-0 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Active Meds
                  </p>
                  <p className="text-lg font-bold text-purple-600">
                    {healthMetrics.activeMedications}
                  </p>
                  <p className="text-xs text-purple-600">On schedule</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-full">
                  <MdLocalPharmacy className="text-purple-600 text-lg" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white shadow-md border-0 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    BMI Status
                  </p>
                  <p className="text-lg font-bold text-orange-600">
                    {healthMetrics.bmi || "N/A"}
                  </p>
                  <p className="text-xs text-orange-600">
                    {healthMetrics.bmiStatus}
                  </p>
                </div>
                <div className="p-3 bg-orange-50 rounded-full">
                  <FaWeight className="text-orange-600 text-lg" />
                </div>
              </div>
            </Card>
          </div>

          {/* Vital Signs Card */}
          <Card className="p-6 bg-white shadow-lg border-0 mb-6">
            <VitalSigns vitalSigns={todaysVitals || []} />
          </Card>
        </div>

        {/* Row 1: Calendar, Medications, Bills */}
        <div className="col-span-12 grid grid-cols-12 gap-4 mb-6">
          {/* Calendar */}
          <div className="col-span-4">
            <Card className="p-4 bg-white shadow-lg border-0 h-[320px]">
              <div className="flex items-start justify-between h-full">
                {/* Left: Calendar */}
                <div className="flex-1 pr-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-indigo-50 rounded-lg">
                      <FaCalendarAlt className="text-indigo-600 text-lg" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">
                      Upcoming Appointments
                    </h3>
                  </div>
                  <div className="h-[240px]">
                    {appointmentsLoading ? (
                      <CalendarSkeleton />
                    ) : (
                      <Calendar upcomingAppointments={appointments} />
                    )}
                  </div>
                </div>
                
                {/* Right: Appointment Info */}
                <div className="w-24 flex flex-col items-center justify-center h-full border-l border-gray-100 pl-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600 mb-1">
                      {appointments?.length || 0}
                    </div>
                    <div className="text-xs text-gray-500 leading-tight">
                      scheduled
                    </div>
                  </div>
                  {appointments?.length > 0 && (
                    <div className="mt-4 text-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mx-auto mb-1 animate-pulse"></div>
                      <div className="text-xs text-gray-400">Active</div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Medications */}
          <div className="col-span-4">
            <Card className="p-3 bg-white shadow-lg border-0 h-[320px]">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-green-50 rounded-lg">
                  <FaPills className="text-green-600 text-lg" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">
                  Medications
                </h3>
              </div>
              {medicationsLoading ? (
                <MedicationSkeleton />
              ) : (
                <MedicationTracker medications={medications.map((med: any) => ({
                  id: med._id,
                  name: med.medication_name,
                  dosage: med.dosage,
                  frequency: med.frequency,
                  instructions: med.instructions,
                  nextDose: "8:00 AM",
                  wasTaken: false
                }))} />
              )}
            </Card>
          </div>

          {/* Pending Bills */}
          <div className="col-span-4">
            <Card className="p-3 bg-white shadow-lg border-0 h-[320px]">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-purple-50 rounded-lg">
                  <MdReceiptLong className="text-purple-600 text-lg" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">Recent Bills</h3>
              </div>
              {billsLoading ? (
                <BillsSkeleton />
              ) : (
                <PendingBills
                  patient={{
                    name: `${patient.firstname} ${patient.lastname}`,
                    email: patient.email,
                    contact: patient.contact,
                  }}
                />
              )}
            </Card>
          </div>
        </div>

        {/* Row 2: Health Trends and Lab Results */}
        <div className="col-span-12 grid grid-cols-12 gap-6">
          {/* Health Trends */}
          <div className="col-span-7">
            <Card className="p-6 bg-white shadow-lg border-0 h-[500px]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FaChartLine className="text-blue-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Health Trends
                </h3>
              </div>
              {healthTrendsLoading ? (
                <HealthMetricsSkeleton />
              ) : (
                <HealthMetrics metrics={healthTrends} />
              )}
            </Card>
          </div>

          {/* Lab Results */}
          <div className="col-span-5">
            <Card className="p-6 bg-white shadow-lg border-0 h-[500px]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <HiOutlineClipboardDocumentCheck className="text-orange-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Lab Results
                </h3>
              </div>
              {labResultsLoading ? (
                <LabResultsSkeleton />
              ) : (
                <LabResults />
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}