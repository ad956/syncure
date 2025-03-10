"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { ResponsiveRadialBar } from "@nivo/radial-bar";

const WeeklyData = [
  {
    id: "Monday",
    data: [{ x: "Monday", y: 80 }],
  },
  {
    id: "Tuesday",
    data: [{ x: "Tuesday", y: 60 }],
  },
  {
    id: "Wednesday",
    data: [{ x: "Wednesday", y: 40 }],
  },
  {
    id: "Thursday",
    data: [{ x: "Thursday", y: 70 }],
  },
  {
    id: "Friday",
    data: [{ x: "Friday", y: 90 }],
  },
  {
    id: "Saturday",
    data: [{ x: "Saturday", y: 50 }],
  },
  {
    id: "Sunday",
    data: [{ x: "Sunday", y: 30 }],
  },
];

const AppointmentBar = ({ data }: any) => (
  <Card className="h-[400px]">
    <CardHeader className="border-b border-gray-200 p-6">
      <h3 className="text-2xl font-semibold text-gray-800">
        Appointments Overview
      </h3>
    </CardHeader>
    <CardBody className="p-6">
      <ResponsiveRadialBar
        data={WeeklyData}
        valueFormat=">-.2f"
        // startAngle={-360}
        // endAngle={-360}
        colors={[
          "#fd893c",
          "#f5547e",
          "#ffa046",
          "#fdde50",
          "#0babcf",
          "#4e5bdb",
          "#9b49ea",
        ]}
        innerRadius={0}
        padding={0.4}
        cornerRadius={2}
        margin={{ top: 40, right: 120, bottom: 40, left: 40 }}
        radialAxisStart={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
        circularAxisOuter={{ tickSize: 5, tickPadding: 12, tickRotation: 0 }}
        legends={[
          {
            anchor: "right",
            direction: "column",
            justify: false,
            translateX: 80,
            translateY: 0,
            itemsSpacing: 6,
            itemDirection: "left-to-right",
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#999",
            symbolSize: 18,
            symbolShape: "square",
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
    </CardBody>
  </Card>
);

export default AppointmentBar;
