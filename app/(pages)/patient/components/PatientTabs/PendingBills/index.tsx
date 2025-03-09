"use client";

import { useEffect, useState } from "react";
import SpinnerLoader from "@components/SpinnerLoader";
import EmptyBillsState from "./EmptyBillsState";
import BillList from "./BillList";
import getPendingBills from "@lib/patient/get-pending-bills";

interface PendingBillProps {
  patient: {
    name: string;
    email: string;
    contact: string;
  };
}

export default function PendingBills({ patient }: PendingBillProps) {
  const [bills, setBills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBills = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getPendingBills();
      console.log(response);
      setBills(response || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load pending bills"
      );
      console.error("Error fetching pending bills:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  if (isLoading) {
    return <SpinnerLoader />;
  }

  if (error || !bills?.length) {
    return <EmptyBillsState error={error} refetch={fetchBills} />;
  }

  return (
    <div className="h-full w-full bg-white rounded-xl p-2 border-2">
      <div className="px-4 py-2 flex justify-between items-center border-b">
        <h2 className="text-sm font-semibold text-gray-700">Recent Bills</h2>
        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
          {bills.length} pending
        </span>
      </div>
      <BillList bills={bills} patient={patient} />
    </div>
  );
}
