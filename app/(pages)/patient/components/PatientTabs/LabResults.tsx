import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  Image,
} from "@nextui-org/react";
import useQuery from "@hooks/useQuery";
import getLabResults from "@lib/patient/get-lab-results";
import SpinnerLoader from "@components/SpinnerLoader";
import { LiaRedoAltSolid } from "react-icons/lia";
import { motion } from "framer-motion";

const LabResults: React.FC = () => {
  const {
    data: labResults,
    isLoading,
    error,
    refetch,
  } = useQuery<LabResult[]>(getLabResults, []);

  if (isLoading) {
    return <SpinnerLoader />;
  }

  if (error || !labResults?.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="flex justify-center items-center h-full w-full text-default-600"
      >
        <Image
          src="/images/appointment2.png"
          width={200}
          height={100}
          alt="no-lab-results"
        />

        {error ? (
          <div className="ml-4 flex items-center gap-1">
            <p className="text-md font-medium text-red-500">{error}</p>
            <LiaRedoAltSolid
              className="cursor-pointer h-5 w-5 text-red-500 hover:text-red-600"
              onClick={refetch}
            />
          </div>
        ) : (
          <div className="ml-4 flex items-center gap-1">
            <p className="text-md font-medium text-gray-500">
              No lab results found.
            </p>
            <LiaRedoAltSolid
              className="cursor-pointer h-5 w-5 text-gray-500 hover:text-gray-600"
              onClick={refetch}
            />
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="h-full border-2 rounded-xl p-2 overflow-y-auto scrollbar">
      <Table
        aria-label="Lab Results"
        classNames={{
          wrapper: "shadow-none",
          th: "bg-default-100/50 text-default-600 font-medium",
          td: "py-4",
        }}
      >
        <TableHeader>
          <TableColumn>TEST ID</TableColumn>
          <TableColumn>TEST NAME</TableColumn>
          <TableColumn className="hidden sm:table-cell">DATE</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn className="hidden sm:table-cell">RESULT</TableColumn>
        </TableHeader>
        <TableBody>
          {labResults.map((result) => (
            <TableRow key={result.id} className="hover:bg-default-100/50">
              <TableCell className="font-medium">{result.id}</TableCell>
              <TableCell>{result.test}</TableCell>
              <TableCell className="hidden sm:table-cell">
                {result.date}
              </TableCell>
              <TableCell>
                <Badge color={getStatusColor(result.status)} variant="flat">
                  {result.status}
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {result.result}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

type StatusColor = "success" | "warning" | "primary" | "default";

const getStatusColor = (status: string): StatusColor => {
  const statusColors: Record<string, StatusColor> = {
    completed: "success",
    pending: "warning",
    processing: "primary",
    online: "success",
    offline: "default",
  };
  return statusColors[status.toLowerCase()] || "default";
};

export default LabResults;
