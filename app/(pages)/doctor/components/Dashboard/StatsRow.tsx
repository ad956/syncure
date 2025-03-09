import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { motion } from "framer-motion";
import React from "react";
import { LuUsers, LuCalendar, LuFileText, LuActivity } from "react-icons/lu";

export default function StatsRow() {
  const stats = [
    {
      title: "Total Patients",
      value: "2,847",
      icon: LuUsers,
      change: "+12.5%",
      description: "from last month",
    },
    {
      title: "Appointments Today",
      value: "12",
      icon: LuCalendar,
      change: "+4.3%",
      description: "from yesterday",
    },
    {
      title: "Pending Reports",
      value: "8",
      icon: LuFileText,
      change: "-2.1%",
      description: "from last week",
    },
    {
      title: "Patient Recovery",
      value: "92%",
      icon: LuActivity,
      change: "+5.7%",
      description: "from last month",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium">{stat.title}</p>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardBody>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span
                    className={
                      stat.change.startsWith("+")
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {stat.change}
                  </span>{" "}
                  {stat.description}
                </p>
              </CardBody>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
