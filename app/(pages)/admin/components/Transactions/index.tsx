"use client";

import React from "react";
import { getFormattedDate } from "@utils/get-date";
import { Chip, Card, Image } from "@nextui-org/react";
import PaginationControls from "@components/PaginationControls";
import SearchInput from "@components/SearchInput";
import StatusFilter from "@components/StatusFilter";
import TransactionsTable from "@components/TransactionsTable";
import useFilterTransaction from "@hooks/useFilterTransaction";

const statusColorMap: any = {
  Failed: "danger",
  Success: "success",
};

type TransactionsProps = {
  transactions: TransactionDetails[];
};

export default function Transactions({ transactions }: TransactionsProps) {
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
  } = useFilterTransaction<TransactionDetails>(transactions);

  const renderCell = React.useCallback(
    (transaction: TransactionDetails, columnKey: React.Key) => {
      switch (columnKey) {
        case "hospital":
          return (
            <div className="flex justify-start items-center gap-2">
              <Image
                src={transaction.hospital.profile}
                alt={transaction.hospital.name}
                className="w-12 h-12 rounded-full"
              />
              <>{transaction.hospital.name}</>
            </div>
          );
        case "patient":
          return (
            <div className="flex justify-start items-center gap-2">
              <Image
                src={transaction.patient.profile}
                alt={transaction.patient.name}
                className="w-12 h-12 rounded-full"
              />
              <>{transaction.patient.name}</>
            </div>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[transaction.status]}
              size="sm"
              variant="flat"
            >
              {transaction.status}
            </Chip>
          );
        case "amount":
          return `₹${transaction.amount.toFixed(2)}`;
        case "date":
          return getFormattedDate(new Date(transaction.date));
        case "transaction_id":
          return <>{transaction.transaction_id}</>;
        case "disease":
          return <>{transaction.disease}</>;
        case "description":
          return <>{transaction.description}</>;
      }
    },
    []
  );

  return (
    <div className="container mx-auto p-4 h-screen overflow-auto scrollbar">
      <Card className="w-full flex-grow p-6 shadow-lg border border-gray-200 space-y-5">
        <h3 className="mb-4 text-xl font-bold text-gray-700">
          Transaction Details
        </h3>
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
              Total {transactions.length} transactions
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
    </div>
  );
}
