"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { FiSearch, FiCalendar } from "react-icons/fi";
import { Card, Input, Select, SelectItem } from "@nextui-org/react";

const patients = [
  {
    id: 1,
    name: "John Doe",
    age: 45,
    gender: "Male",
    appointmentDate: "2024-03-10",
  },
  {
    id: 2,
    name: "Joe Smith",
    age: 32,
    gender: "Male",
    appointmentDate: "2024-03-11",
  },
  {
    id: 3,
    name: "Robert Johnson",
    age: 50,
    gender: "Male",
    appointmentDate: "2024-03-12",
  },
  {
    id: 4,
    name: "Emily Davis",
    age: 29,
    gender: "Female",
    appointmentDate: "2024-03-13",
  },
  {
    id: 5,
    name: "Michael Brown",
    age: 38,
    gender: "Male",
    appointmentDate: "2024-03-14",
  },
  {
    id: 6,
    name: "Sophia Wilson",
    age: 27,
    gender: "Female",
    appointmentDate: "2024-03-15",
  },
  {
    id: 7,
    name: "David Martinez",
    age: 42,
    gender: "Male",
    appointmentDate: "2024-03-16",
  },
  {
    id: 8,
    name: "Olivia Taylor",
    age: 34,
    gender: "Female",
    appointmentDate: "2024-03-17",
  },
];

const genderData = [
  {
    id: "male",
    label: "Male",
    value: patients.filter((e) => e.gender === "Male").length,
  },
  {
    id: "female",
    label: "Female",
    value: patients.filter((e) => e.gender !== "Male").length,
  },
];

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGender, setSelectedGender] = useState("");

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedGender === "" ||
        patient.gender.toLowerCase() === selectedGender.toLowerCase())
  );

  return (
    <section className="bg-white/75 bg[#f3f6fd] overflow-y-auto scrollbar flex flex-col justify-center items-center">
      <h1 className="text-2xl  mb-8 ml-8">Patients Management</h1>

      <div className="h-4/5 w-4/5 grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="col-span-2 p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startContent={<FiSearch className="text-gray-400" />}
              />
            </div>
            <Select
              placeholder="Filter by gender"
              selectedKeys={selectedGender ? [selectedGender] : []}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-48"
            >
              <SelectItem key="" value="">
                All
              </SelectItem>
              <SelectItem key="male" value="male">
                Male
              </SelectItem>
              <SelectItem key="female" value="female">
                Female
              </SelectItem>
            </Select>
          </div>

          <div className="space-y-4 overflow-y-auto scrollbar mt-3">
            {filteredPatients.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="w-full">
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {patient.name}
                        </h3>
                        <p className="text-gray-600">
                          {patient.age} years • {patient.gender}
                        </p>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <FiCalendar className="mr-2" />
                        <span>
                          {new Date(
                            patient.appointmentDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Patient Demographics</h2>
          <div className="h-[300px]">
            <ResponsivePie
              data={genderData}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              colors={{ scheme: "nivo" }}
              borderWidth={1}
              borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
              enableArcLinkLabels={true}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: "color" }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{
                from: "color",
                modifiers: [["darker", 2]],
              }}
              legends={[
                {
                  anchor: "bottom",
                  direction: "row",
                  justify: false,
                  translateX: 0,
                  translateY: 56,
                  itemsSpacing: 0,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: "#999",
                  itemDirection: "left-to-right",
                  itemOpacity: 1,
                  symbolSize: 18,
                  symbolShape: "circle",
                },
              ]}
            />
          </div>
        </Card>
      </div>
    </section>
  );
}
