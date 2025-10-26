"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardBody,
  Chip,
  User,
  Spinner,
} from "@nextui-org/react";
import { FiFileText } from "react-icons/fi";

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = "No data available",
  className = "",
}: DataTableProps<T>) {
  if (loading) {
    return (
      <Card className={className}>
        <CardBody className="flex items-center justify-center py-12">
          <Spinner size="lg" />
          <p className="text-gray-500 mt-4">Loading...</p>
        </CardBody>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardBody className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiFileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Data Found</h3>
          <p className="text-gray-500 text-center">{emptyMessage}</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardBody className="p-0">
        <Table aria-label="Data table" className="min-w-full">
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={String(column.key)} allowsSorting={column.sortable}>
                {column.label}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <TableCell key={String(column.key)}>
                    {column.render ? column.render(item) : item[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}