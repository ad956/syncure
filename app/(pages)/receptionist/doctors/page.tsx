"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { FiSearch, FiUser, FiBriefcase } from "react-icons/fi";
import { Card, Input, Select, SelectItem, Chip } from "@nextui-org/react";

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Wilson",
    specialization: "Cardiology",
    experience: 12,
    availability: "Available",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialization: "Neurology",
    experience: 8,
    availability: "Busy",
  },
  {
    id: 3,
    name: "Dr. Emily Carter",
    specialization: "Pediatrics",
    experience: 10,
    availability: "Available",
  },
  {
    id: 4,
    name: "Dr. James Anderson",
    specialization: "Orthopedics",
    experience: 15,
    availability: "Available",
  },
  {
    id: 5,
    name: "Dr. Sophia Patel",
    specialization: "Dermatology",
    experience: 7,
    availability: "Busy",
  },
  {
    id: 6,
    name: "Dr. David Lee",
    specialization: "General Surgery",
    experience: 11,
    availability: "Available",
  },
  {
    id: 7,
    name: "Dr. Olivia Martinez",
    specialization: "Gynecology",
    experience: 9,
    availability: "Busy",
  },
  {
    id: 8,
    name: "Dr. Robert Johnson",
    specialization: "Radiology",
    experience: 13,
    availability: "Available",
  },
];

const departmentData = [
  { department: "Cardiology", count: 5 },
  { department: "Neurology", count: 3 },
  { department: "Pediatrics", count: 4 },
  { department: "Orthopedics", count: 3 },
  { department: "Dermatology", count: 4 },
  { department: "General Surgery", count: 6 },
  { department: "Gynecology", count: 5 },
  { department: "Radiology", count: 2 },
];

export const dynamic = 'force-dynamic';

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedSpecialization === "" ||
        doctor.specialization.toLowerCase() ===
          selectedSpecialization.toLowerCase())
  );

  return (
    <section className="bg-white/75 overflow-y-auto scrollbar flex flex-col justify-center items-center">
      <h1 className="text-2xl  mb-8 ml-8">Doctors Directory</h1>

      <div className="h-4/5 w-full px-10  grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="col-span-2 p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startContent={<FiSearch className="text-gray-400" />}
              />
            </div>
            <Select
              placeholder="Filter by specialization"
              selectedKeys={
                selectedSpecialization ? [selectedSpecialization] : []
              }
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-64"
            >
              <SelectItem key="" value="">
                All
              </SelectItem>
              <SelectItem key="cardiology" value="cardiology">
                Cardiology
              </SelectItem>
              <SelectItem key="neurology" value="neurology">
                Neurology
              </SelectItem>
              <SelectItem key="pediatrics" value="pediatrics">
                Pediatrics
              </SelectItem>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto overflow-x-hidden scrollbar">
            {filteredDoctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="w-full">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-3">
                        <FiUser className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{doctor.name}</h3>
                        <p className="text-gray-600 flex items-center gap-2">
                          <FiBriefcase className="w-4 h-4" />
                          {doctor.specialization}
                        </p>
                        <div className="mt-2 flex items-center gap-4">
                          <span className="text-sm text-gray-500">
                            {doctor.experience} years experience
                          </span>
                          <Chip
                            color={
                              doctor.availability === "Available"
                                ? "success"
                                : "danger"
                            }
                            variant="flat"
                            size="sm"
                          >
                            {doctor.availability}
                          </Chip>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Department Distribution
          </h2>
          <div className="h-[400px]">
            <ResponsiveBar
              data={departmentData}
              keys={["count"]}
              indexBy="department"
              margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
              padding={0.3}
              valueScale={{ type: "linear" }}
              colors={{ scheme: "nivo" }}
              borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: "Department",
                legendPosition: "middle",
                legendOffset: 40,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Number of Doctors",
                legendPosition: "middle",
                legendOffset: -40,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
              animate={true}
            />
          </div>
        </Card>
      </div>
    </section>
  );
}
