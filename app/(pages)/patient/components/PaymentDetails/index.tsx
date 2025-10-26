"use client";

import React from "react";
import { getFormattedDate } from "@utils/get-date";
import { Chip, User, Card } from "@nextui-org/react";
import PaginationControls from "@components/PaginationControls";
import SearchInput from "@components/SearchInput";
import StatusFilter from "@components/StatusFilter";
import TransactionsTable from "@components/TransactionsTable";
import useFilterTransaction from "@hooks/useFilterTransaction";
import { PaymentHistory } from "@lib/validations/patient";

const statusColorMap: any = {
  Failed: "danger",
  Success: "success",
  Pending: "warning",
};

interface PaymentDetailsProps {
  paymentHistory: PaymentHistory[];
}

export default function PaymentDetails({ paymentHistory }: PaymentDetailsProps) {
  const {
    filterValue,
    statusFilter,
    page,
    pages,
    sortDescriptor,
    sortedItems,
    setPage,
    onNextPage,
    onPreviousPage,
    onSearchChange,
    onClear,
    onStatusFilterChange,
    setSortDescriptor,
    setRowsPerPage,
  } = useFilterTransaction(paymentHistory);

  const handleDownloadReceipt = async (appointmentId: string) => {
    try {
      const response = await fetch(`/api/patient/appointments/download-receipt?appointmentId=${appointmentId}`);
      if (response.ok) {
        window.open(response.url, '_blank');
      } else {
        alert('Receipt not available');
      }
    } catch (error) {
      console.error('Error downloading receipt:', error);
      alert('Failed to download receipt');
    }
  };

  const renderCell = React.useCallback(
    (payment: PaymentHistory, columnKey: React.Key) => {
      switch (columnKey) {
        case "hospital":
          return (
            <User
              avatarProps={{
                radius: "lg",
                src: payment.hospital.profile,
                size: "sm",
              }}
              name={payment.hospital.name}
              description={payment.hospital.name}
              className="text-xs md:text-sm"
            />
          );
        case "status":
          return (
            <Chip
              className="capitalize text-xs md:text-sm"
              color={statusColorMap[payment.status]}
              size="sm"
              variant="flat"
            >
              {payment.status}
            </Chip>
          );
        case "date":
          return getFormattedDate(new Date(payment.date));
        case "amount":
          return `₹${payment.amount.toFixed(2)}`;
        case "actions":
          return (
            <button
              onClick={() => handleDownloadReceipt(payment._id!)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Download Receipt
            </button>
          );
        default:
          return payment[columnKey as keyof PaymentHistory]?.toString() || "";
      }
    },
    []
  );

  return (
    <Card className="w-full p-4 space-y-5 overflow-auto scrollbar">
      <h2 className="text-2xl font-bold mb-4">Payment History</h2>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <SearchInput
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
          <StatusFilter
            statusFilter={statusFilter}
            onStatusFilterChange={onStatusFilterChange}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {paymentHistory.length} payments
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
      <TransactionsTable
        items={sortedItems}
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        renderCell={renderCell}
      />
      <PaginationControls
        page={page}
        pages={pages}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
        setPage={setPage}
      />
    </Card>
  );
}