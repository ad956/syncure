"use client";

import React from "react";
import { getFormattedDate } from "@utils/get-date";
import { Chip, User, Card } from "@nextui-org/react";
import PaginationControls from "@components/PaginationControls";
import SearchInput from "@components/SearchInput";
import StatusFilter from "@components/StatusFilter";
import TransactionsTable from "@components/TransactionsTable";
import useFilterTransaction from "@hooks/useFilterTransaction";
import { MedicalHistory } from "@lib/validations/patient";

const statusColorMap: any = {
  Completed: "success",
  Ongoing: "warning",
  Cancelled: "danger",
};

interface MedicalDetailsProps {
  medicalDetails: MedicalHistory[];
}

export default function MedicalDetails({ medicalDetails }: MedicalDetailsProps) {
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
  } = useFilterTransaction(medicalDetails);

  const renderCell = React.useCallback(
    (history: MedicalHistory, columnKey: React.Key) => {
      switch (columnKey) {
        case "hospital":
          return (
            <User
              avatarProps={{
                radius: "lg",
                src: history.hospital.profile,
                size: "sm",
              }}
              name={history.hospital.name}
              className="text-xs md:text-sm"
            />
          );
        case "TreatmentStatus":
          return (
            <Chip
              className="capitalize text-xs md:text-sm"
              color={statusColorMap[history.TreatmentStatus]}
              size="sm"
              variant="flat"
            >
              {history.TreatmentStatus}
            </Chip>
          );
        case "start_date":
          return getFormattedDate(new Date(history.start_date));
        case "end_date":
          return getFormattedDate(new Date(history.end_date));
        case "doctor":
          return (
            <User
              avatarProps={{
                radius: "lg",
                src: history.doctor.profile,
                size: "sm",
              }}
              name={history.doctor.name}
              className="text-xs md:text-sm"
            />
          );
        default:
          return history[columnKey as keyof MedicalHistory]?.toString() || "";
      }
    },
    []
  );

  return (
    <Card className="w-full p-4 space-y-5 overflow-auto scrollbar">
      <h2 className="text-2xl font-bold mb-4">Medical History</h2>
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
            Total {medicalDetails.length} records
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