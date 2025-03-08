import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { motion } from "framer-motion";
import React from "react";
import { LuCalendar } from "react-icons/lu";

export default function UpcomingAppointment() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
    >
      <Card>
        <CardHeader>
          <p className="flex items-center gap-2">
            <LuCalendar className="h-5 w-5" />
            Today's Appointments
          </p>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">Patient</th>
                  <th className="py-2 px-4 text-left">Time</th>
                  <th className="py-2 px-4 text-left">Type</th>
                  <th className="py-2 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-4">Sarah Johnson</td>
                  <td className="py-2 px-4">09:00 AM</td>
                  <td className="py-2 px-4">Follow-up</td>
                  <td className="py-2 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Confirmed
                    </span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">Michael Smith</td>
                  <td className="py-2 px-4">10:30 AM</td>
                  <td className="py-2 px-4">New Patient</td>
                  <td className="py-2 px-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Arrived
                    </span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">Emma Davis</td>
                  <td className="py-2 px-4">01:15 PM</td>
                  <td className="py-2 px-4">Consultation</td>
                  <td className="py-2 px-4">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      Pending
                    </span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">Robert Wilson</td>
                  <td className="py-2 px-4">03:00 PM</td>
                  <td className="py-2 px-4">Follow-up</td>
                  <td className="py-2 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Confirmed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
