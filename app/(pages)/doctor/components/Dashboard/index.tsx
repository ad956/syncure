"use client";

import React from "react";
import { motion } from "framer-motion";
import { useDoctor } from "@hooks/useDoctor";
import StatsRow from "./StatsRow";
import Charts from "./Charts";
import UpcomingAppointment from "./UpcomingAppointment";
import SpinnerLoader from "@components/SpinnerLoader";

export default function Dashboard() {
  const { doctor, isLoading, error } = useDoctor();

  if (isLoading) return <SpinnerLoader />;
  if (error) return <div>Error loading doctor data</div>;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen space-y-6 p-3 overflow-y-scroll"
    >
      {/* Stats row */}
      <StatsRow />

      {/* Charts - first row */}
      <Charts />

      {/* Upcoming Appointments Section */}
      <UpcomingAppointment />
    </motion.div>
  );
}
