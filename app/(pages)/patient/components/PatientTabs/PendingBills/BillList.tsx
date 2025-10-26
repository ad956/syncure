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
      className={`h-[240px] space-y-1 ${
        filteredBills.length <= 3
          ? "overflow-y-hidden"
          : "overflow-y-auto bills-scroll"
      }`}
    >
      {filteredBills.map((bill: any, index: number) => (
        <BillItem
          key={bill._id || bill.txnDocumentId || index}
          bill={bill}
          patient={patient}
          onPaymentComplete={handlePaymentComplete}
        />
      ))}
    </div>
  );
}
