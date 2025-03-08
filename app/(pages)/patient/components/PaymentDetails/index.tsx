"use client";

import React from "react";
import { getFormattedDate } from "@utils/get-date";
import { Chip, User, Card } from "@nextui-org/react";
import PaginationControls from "@components/PaginationControls";
import SearchInput from "@components/SearchInput";
import StatusFilter from "@components/StatusFilter";
import TransactionsTable from "@components/TransactionsTable";
import useFilterTransaction from "@hooks/useFilterTransaction";

const statusColorMap: any = {
  Failed: "danger",
  Success: "success",
  Pending: "warning",
};

export default function PaymentDetails({
  paymentHistory,
}: PaymentDetailsProps) {
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

  const renderCell = React.useCallback(
    (payment: Payment, columnKey: React.Key) => {
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
          return `₹${payment.amount.toFixed(2)}`; // Format to 2 decimal places
        default:
          return payment[columnKey as keyof Payment]?.toString() || "";
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
