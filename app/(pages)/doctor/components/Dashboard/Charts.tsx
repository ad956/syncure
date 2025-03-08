import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveRadar } from "@nivo/radar";
import { motion } from "framer-motion";
import React from "react";
import {
  LuTrendingUp,
  LuPieChart,
  LuBarChart,
  LuActivity,
} from "react-icons/lu";

export default function Charts() {
  const patientTrends = [
    {
      id: "new patients",
      color: "#3182ce",
      data: [
        { x: "Jan", y: 45 },
        { x: "Feb", y: 52 },
        { x: "Mar", y: 48 },
        { x: "Apr", y: 61 },
        { x: "May", y: 55 },
        { x: "Jun", y: 67 },
      ],
    },
    {
      id: "recovered",
      color: "#38a169",
      data: [
        { x: "Jan", y: 38 },
        { x: "Feb", y: 42 },
        { x: "Mar", y: 40 },
        { x: "Apr", y: 47 },
        { x: "May", y: 44 },
        { x: "Jun", y: 53 },
      ],
    },
    {
      id: "referrals",
      color: "#e53e3e",
      data: [
        { x: "Jan", y: 12 },
        { x: "Feb", y: 15 },
        { x: "Mar", y: 13 },
        { x: "Apr", y: 18 },
        { x: "May", y: 16 },
        { x: "Jun", y: 21 },
      ],
    },
  ];

  const diagnosisDistribution = [
    {
      id: "Respiratory",
      label: "Respiratory",
      value: 35,
      color: "hsl(190, 70%, 50%)",
    },
    {
      id: "Cardiovascular",
      label: "Cardiovascular",
      value: 25,
      color: "hsl(290, 70%, 50%)",
    },
    {
      id: "Orthopedic",
      label: "Orthopedic",
      value: 20,
      color: "hsl(50, 70%, 50%)",
    },
    {
      id: "Neurological",
      label: "Neurological",
      value: 15,
      color: "hsl(120, 70%, 50%)",
    },
    {
      id: "Other",
      label: "Other",
      value: 5,
      color: "hsl(230, 70%, 50%)",
    },
  ];

  const appointmentsByDay = [
    { day: "Mon", appointments: 24, followups: 10, color: "hsl(50, 70%, 50%)" },
    { day: "Tue", appointments: 18, followups: 8, color: "hsl(100, 70%, 50%)" },
    {
      day: "Wed",
      appointments: 30,
      followups: 12,
      color: "hsl(150, 70%, 50%)",
    },
    { day: "Thu", appointments: 22, followups: 9, color: "hsl(200, 70%, 50%)" },
    {
      day: "Fri",
      appointments: 28,
      followups: 11,
      color: "hsl(250, 70%, 50%)",
    },
  ];

  const departmentMetrics = [
    {
      metric: "Cardiology",
      patients: 85,
      satisfaction: 92,
      recovery: 88,
      wait_time: 78,
    },
    {
      metric: "Neurology",
      patients: 75,
      satisfaction: 88,
      recovery: 82,
      wait_time: 82,
    },
    {
      metric: "Orthopedics",
      patients: 90,
      satisfaction: 95,
      recovery: 91,
      wait_time: 88,
    },
    {
      metric: "Pediatrics",
      patients: 82,
      satisfaction: 90,
      recovery: 87,
      wait_time: 85,
    },
    {
      metric: "Oncology",
      patients: 78,
      satisfaction: 86,
      recovery: 80,
      wait_time: 75,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Patient Trends Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <p className="flex items-center gap-2">
              <LuTrendingUp className="h-5 w-5" />
              Patient Trends
            </p>
          </CardHeader>
          <CardBody>
            <div className="h-[300px]">
              <ResponsiveLine
                data={patientTrends}
                margin={{ top: 10, right: 110, bottom: 50, left: 60 }}
                xScale={{ type: "point" }}
                yScale={{
                  type: "linear",
                  min: "auto",
                  max: "auto",
                  stacked: false,
                  reverse: false,
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Month",
                  legendOffset: 36,
                  legendPosition: "middle",
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Count",
                  legendOffset: -40,
                  legendPosition: "middle",
                }}
                pointSize={10}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabelYOffset={-12}
                useMesh={true}
                enableSlices="x"
                enableCrosshair={true}
                legends={[
                  {
                    anchor: "right",
                    direction: "column",
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: "left-to-right",
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: "circle",
                    symbolBorderColor: "rgba(0, 0, 0, .5)",
                    effects: [
                      {
                        on: "hover",
                        style: {
                          itemBackground: "rgba(0, 0, 0, .03)",
                          itemOpacity: 1,
                        },
                      },
                    ],
                  },
                ]}
              />
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Diagnosis Distribution Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <p className="flex items-center gap-2">
              <LuPieChart className="h-5 w-5" />
              Diagnosis Distribution
            </p>
          </CardHeader>
          <CardBody>
            <div className="h-[300px]">
              {diagnosisDistribution && (
                <ResponsivePie
                  data={diagnosisDistribution}
                  margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
                  innerRadius={0.6}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  colors={{ scheme: "paired" }}
                  borderWidth={1}
                  borderColor={{
                    from: "color",
                    modifiers: [["darker", 0.2]],
                  }}
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
                      anchor: "right",
                      direction: "column",
                      justify: false,
                      translateX: 70,
                      translateY: 0,
                      itemsSpacing: 5,
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
              )}
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Weekly Appointments Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <p className="flex items-center gap-2">
              <LuBarChart className="h-5 w-5" />
              Weekly Appointments
            </p>
          </CardHeader>
          <CardBody>
            <div className="h-[300px]">
              {appointmentsByDay && (
                <ResponsiveBar
                  data={appointmentsByDay}
                  keys={["appointments", "followups"]}
                  indexBy="day"
                  margin={{ top: 20, right: 130, bottom: 50, left: 60 }}
                  padding={0.3}
                  groupMode="grouped"
                  valueScale={{ type: "linear" }}
                  indexScale={{ type: "band", round: true }}
                  colors={{ scheme: "paired" }}
                  borderColor={{
                    from: "color",
                    modifiers: [["darker", 1.6]],
                  }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Day of Week",
                    legendPosition: "middle",
                    legendOffset: 32,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Count",
                    legendPosition: "middle",
                    legendOffset: -40,
                  }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor={{
                    from: "color",
                    modifiers: [["darker", 1.6]],
                  }}
                  legends={[
                    {
                      dataFrom: "keys",
                      anchor: "right",
                      direction: "column",
                      justify: false,
                      translateX: 120,
                      translateY: 0,
                      itemsSpacing: 2,
                      itemWidth: 100,
                      itemHeight: 20,
                      itemDirection: "left-to-right",
                      itemOpacity: 0.85,
                      symbolSize: 20,
                      effects: [
                        {
                          on: "hover",
                          style: {
                            itemOpacity: 1,
                          },
                        },
                      ],
                    },
                  ]}
                />
              )}
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Department Performance Radar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <p className="flex items-center gap-2">
              <LuActivity className="h-5 w-5" />
              Department Performance
            </p>
          </CardHeader>
          <CardBody>
            <div className="h-[300px]">
              {departmentMetrics && (
                <ResponsiveRadar
                  data={departmentMetrics}
                  keys={["patients", "satisfaction", "recovery", "wait_time"]}
                  indexBy="metric"
                  maxValue={100}
                  margin={{ top: 30, right: 130, bottom: 30, left: 70 }}
                  curve="linearClosed"
                  gridShape="circular"
                  gridLevels={5}
                  gridLabelOffset={36}
                  enableDots={true}
                  dotSize={10}
                  dotColor={{ theme: "background" }}
                  dotBorderWidth={2}
                  dotBorderColor={{ from: "color" }}
                  colors={{ scheme: "category10" }}
                  fillOpacity={0.25}
                  blendMode="multiply"
                  legends={[
                    {
                      anchor: "right",
                      direction: "column",
                      translateX: 100,
                      translateY: 0,
                      itemWidth: 80,
                      itemHeight: 20,
                      itemTextColor: "#999",
                      symbolSize: 12,
                      symbolShape: "circle",
                      effects: [
                        {
                          on: "hover",
                          style: {
                            itemTextColor: "#000",
                          },
                        },
                      ],
                    },
                  ]}
                />
              )}
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
