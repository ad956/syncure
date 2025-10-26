"use client";

import { motion } from "framer-motion";
import { IoCheckmarkCircle } from "react-icons/io5";

export default function EmptyBillsState() {
  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center"
      >
        <div className="p-4 bg-green-50 rounded-full mb-4">
          <IoCheckmarkCircle className="text-green-500 text-3xl" />
        </div>
        <p className="text-lg font-semibold text-gray-700 mb-2">
          All Settled!
        </p>
        <p className="text-sm text-gray-500">
          No outstanding payments
        </p>
      </motion.div>
    </div>
  );
}
