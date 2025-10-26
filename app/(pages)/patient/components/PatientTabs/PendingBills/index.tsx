"use client";

import EmptyBillsState from "./EmptyBillsState";
import BillList from "./BillList";
import { usePendingBills } from "@lib/hooks/patient";

interface PendingBillProps {
  patient: {
    name: string;
    email: string;
    contact: string;
  };
}

export default function PendingBills({ patient }: PendingBillProps) {
  const { pendingBills: bills, isLoading: loading } = usePendingBills();

  if (loading) {
    return <div className="flex justify-center p-4">Loading...</div>;
  }

  if (!bills?.length) {
    return <EmptyBillsState />;
  }

  return (
    <div className="h-full w-full">
      <div className="h-full">
        <BillList bills={bills} patient={patient} />
      </div>
    </div>
  );
}
