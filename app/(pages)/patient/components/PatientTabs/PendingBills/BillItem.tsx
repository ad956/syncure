"use client";

import savePendingBillTransaction from "@lib/patient/save-pending-bill-transaction";
import processPayment from "@lib/razorpay/process-payment";
import { getFormattedDate } from "@utils/get-date";
import { Avatar } from "@nextui-org/react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { BiChevronRight } from "react-icons/bi";

export default function BillItem({
  bill,
  patient,
  onPaymentComplete,
}: any) {
  async function handlePendingBillPayment() {
    try {
      toast.loading("Please wait ...", { duration: 1500 });
      const paymentResult = await processPayment(
        patient.name,
        patient.email,
        `Pending bill payment for ${bill.hospital.name}`,
        bill.amount.toString()
      );
      toast.dismiss();
      const status = paymentResult.success ? "Success" : "Failed";
      if (!paymentResult.success) {
        toast.error(paymentResult.message, {
          duration: 2000,
          position: "bottom-center",
        });
      } else {
        toast.success("Your bill has been paid successfully 💸", {
          id: "payment-success",
          duration: 2000,
          position: "top-center",
        });
        onPaymentComplete(bill);
      }
      await savePendingBillTransaction(
        bill.txnDocumentId,
        paymentResult.transaction_id,
        status
      );
    } catch (error: any) {
      console.log("Error : " + error.message);
      toast.error(error.message || "Pending Bill Payment Failed !!", {
        position: "top-right",
        duration: 2000,
      });
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeIn" }}
      className="group flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
      onClick={handlePendingBillPayment}
    >
      {/* left: hospital info */}
      <div className="flex items-center gap-3 flex-1">
        <Avatar
          className="w-8 h-8 border-2 border-white shadow-sm"
          src={bill.hospital?.profile}
          fallback={bill.hospital?.name?.[0] || 'H'}
        />
        <div>
          <h3 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
            {bill.hospital?.name || 'Unknown Hospital'}
          </h3>
          <p className="text-xs text-gray-500">
            {getFormattedDate(new Date(bill.date))}
          </p>
        </div>
      </div>

      {/* right: amount & arrow */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">
            ₹{bill.amount.toFixed(2)}
          </p>
          <p className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
            Due soon
          </p>
        </div>
        <BiChevronRight className="w-4 h-4 text-gray-300 group-hover:text-purple-500 transition-colors" />
      </div>
    </motion.div>
  );
}
