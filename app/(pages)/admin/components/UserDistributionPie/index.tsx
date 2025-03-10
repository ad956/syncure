"use client";

import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { ResponsivePie } from "@nivo/pie";

const UserDistributionPie = ({ data }: any) => (
  <Card className="h-[400px]">
    <CardHeader className="border-b border-gray-200 p-6">
      <h3 className="text-2xl font-semibold text-gray-800">Users Overview</h3>
    </CardHeader>
    <CardBody className="p-6">
      <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        arcLinkLabelsSkipAngle={0}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsRadiusOffset={0.55}
        arcLabelsSkipAngle={0}
        arcLabelsTextColor="#ffffff"
        colors={["#FF6B6B", "#FFA500", "#FFD700", "#9370DB", "#00CED1"]}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            rotation: -45,
            lineWidth: 4,
            spacing: 10,
          },
        ]}
        fill={[
          { match: { id: "admins" }, id: "lines" },
          { match: { id: "patients" }, id: "dots" },
          { match: { id: "doctors" }, id: "lines" },
          { match: { id: "receptionists" }, id: "dots" },
          { match: { id: "hospitals" }, id: "lines" },
        ]}
        motionConfig="wobbly"
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

export default UserDistributionPie;
