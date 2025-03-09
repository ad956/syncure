"use client";

import { useState } from "react";
import BillItem from "./BillItem";

export default function BillList({ bills, patient }: any) {
  const [filteredBills, setFilteredBills] = useState(bills);

  function handlePaymentComplete(paidBill: any) {
    setFilteredBills(filteredBills.filter((bill: any) => bill !== paidBill));
  }

  return (
    <div
      className={`h-[120px] space-y-1 p-2 ${
        filteredBills.length <= 2
          ? "overflow-y-hidden"
          : "overflow-y-auto scrollbar"
      }`}
    >
      {filteredBills.map((bill: any, index: number) => (
        <BillItem
          key={index}
          bill={bill}
          patient={patient}
          onPaymentComplete={handlePaymentComplete}
        />
      ))}
    </div>
  );
}
