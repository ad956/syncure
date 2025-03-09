"use client";

import { Image } from "@nextui-org/react";
import { motion } from "framer-motion";
import { LiaRedoAltSolid } from "react-icons/lia";

export default function EmptyBillsState({ error, refetch }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="flex justify-center items-center h-full w-full p-4 text-default-600"
    >
      <Image
        src="/images/no_pending_bills.png"
        width={200}
        height={100}
        alt="no-pending-bills"
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
            No pending bills found.
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
