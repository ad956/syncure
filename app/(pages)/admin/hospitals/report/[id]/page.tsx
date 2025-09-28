"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Dropdown,
  Button,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import { getHospitalDetails } from "@lib/admin/get-hospitals";
import SpinnerLoader from "@components/SpinnerLoader";

export const dynamic = 'force-dynamic';

function HospitalReports({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState("This Month");

  useEffect(() => {
    fetchReportData();
  }, [selectedTimeRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      // Assuming getHospitalDetails is modified to return report data
      // const data = await getHospitalDetails(params.id, selectedTimeRange);
      // setReportData(data);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Sample data - replace with actual data from API
  const pieData = [
    { id: "Cardiology", value: 30 },
    { id: "Neurology", value: 20 },
    { id: "Pediatrics", value: 15 },
    { id: "Oncology", value: 25 },
    { id: "Other", value: 10 },
  ];

  const lineData = [
    {
      id: "Patients",
      data: [
        { x: "Jan", y: 100 },
        { x: "Feb", y: 120 },
        { x: "Mar", y: 90 },
        { x: "Apr", y: 140 },
        { x: "May", y: 160 },
      ],
    },
  ];

  const barData = [
    { department: "Emergency", revenue: 50000 },
    { department: "Surgery", revenue: 75000 },
    { department: "ICU", revenue: 60000 },
    { department: "Radiology", revenue: 45000 },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SpinnerLoader />
      </div>
    );
  }

  return (
    <div className="p-4 max-h-screen">
      <Card className="p-6 w-full h-full flex flex-col overflow-y-scroll scrollbar-hide">
        <h1 className="text-2xl font-bold mb-6">Hospital Reports Dashboard</h1>

        <div className="mb-6">
          <Dropdown>
            <Button variant="flat">{selectedTimeRange}</Button>
            <DropdownMenu
              aria-label="Time range selection"
              onAction={(key: any) => setSelectedTimeRange(key.toString())}
            >
              <DropdownItem key="This Week">This Week</DropdownItem>
              <DropdownItem key="This Month">This Month</DropdownItem>
              <DropdownItem key="This Year">This Year</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="w-full h-80">
            <CardHeader>
              <h2 className="text-lg font-semibold">
                Patient Distribution by Department
              </h2>
            </CardHeader>
            <CardBody>
              <ResponsivePie
                data={pieData}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={{ scheme: "nivo" }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor="#ffffff"
              />
            </CardBody>
          </Card>

          <Card className="w-full h-80">
            <CardHeader>
              <h2 className="text-lg font-semibold">Patient Trends</h2>
            </CardHeader>
            <CardBody>
              <ResponsiveLine
                data={lineData}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{ type: "point" }}
                yScale={{
                  type: "linear",
                  min: "auto",
                  max: "auto",
                  stacked: true,
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
                  legend: "Patient Count",
                  legendOffset: -40,
                  legendPosition: "middle",
                }}
                pointSize={10}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabelYOffset={-12}
                useMesh={true}
              />
            </CardBody>
          </Card>

          <Card className="w-full h-80 md:col-span-2">
            <CardHeader>
              <h2 className="text-lg font-semibold">Revenue by Department</h2>
            </CardHeader>
            <CardBody>
              <ResponsiveBar
                data={barData}
                keys={["revenue"]}
                indexBy="department"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                colors={{ scheme: "nivo" }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Department",
                  legendPosition: "middle",
                  legendOffset: 32,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Revenue ($)",
                  legendPosition: "middle",
                  legendOffset: -40,
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor="#ffffff"
              />
            </CardBody>
          </Card>
        </div>
      </Card>
    </div>
  );
}

export default HospitalReports;
