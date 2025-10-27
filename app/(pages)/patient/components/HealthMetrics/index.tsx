"use client";

import { Card, Progress, Chip } from "@nextui-org/react";
import { ResponsiveLine } from "@nivo/line";
import { FaArrowUp, FaArrowDown, FaMinus } from "react-icons/fa";

interface HealthMetric {
  name: string;
  current: number;
  target?: number;
  unit: string;
  trend: "up" | "down" | "stable";
  status: "good" | "warning" | "danger";
  data: { x: string; y: number }[];
}

interface HealthMetricsProps {
  metrics: any[];
}

export default function HealthMetrics({ metrics }: HealthMetricsProps) {
  // Process real vital signs data for chart
  const processVitalSigns = (vitals: any[]) => {
    if (!vitals || !Array.isArray(vitals) || vitals.length === 0) {
      // Fallback data if no vitals available
      return [
        {
          id: "Weight (kg)",
          data: [
            { x: "Jan", y: 75 },
            { x: "Feb", y: 74.5 },
            { x: "Mar", y: 73.8 },
            { x: "Apr", y: 73.2 },
            { x: "May", y: 72.8 },
            { x: "Jun", y: 72.5 },
          ]
        },
        {
          id: "Blood Pressure (mmHg)",
          data: [
            { x: "Jan", y: 135 },
            { x: "Feb", y: 132 },
            { x: "Mar", y: 128 },
            { x: "Apr", y: 126 },
            { x: "May", y: 125 },
            { x: "Jun", y: 124 },
          ]
        },
        {
          id: "Heart Rate (bpm)",
          data: [
            { x: "Jan", y: 78 },
            { x: "Feb", y: 76 },
            { x: "Mar", y: 74 },
            { x: "Apr", y: 72 },
            { x: "May", y: 71 },
            { x: "Jun", y: 70 },
          ]
        }
      ];
    }

    const weightData: { x: string; y: number }[] = [];
    const bpData: { x: string; y: number }[] = [];
    const hrData: { x: string; y: number }[] = [];

    vitals.forEach((vital, index) => {
      const date = new Date(vital.recorded_at);
      const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      if (vital.weight) {
        weightData.push({ x: label, y: vital.weight });
      }
      if (vital.systolic_bp || vital.blood_pressure?.systolic) {
        bpData.push({ x: label, y: vital.systolic_bp || vital.blood_pressure.systolic });
      }
      if (vital.heart_rate) {
        hrData.push({ x: label, y: vital.heart_rate });
      }
    });

    return [
      { id: "Weight (kg)", data: weightData },
      { id: "Blood Pressure (mmHg)", data: bpData },
      { id: "Heart Rate (bpm)", data: hrData }
    ].filter(dataset => dataset.data.length > 0);
  };

  const healthData = processVitalSigns(metrics);

  return (
    <div className="h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Health Trends Over Time</h3>
      
      <div className="h-80">
        {healthData.length > 0 ? (
          <ResponsiveLine
            data={healthData}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
            curve="catmullRom"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
            }}
            colors={['#22c55e', '#ef4444', '#3b82f6']}
            pointSize={8}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            useMesh={true}
            enableGridX={true}
            enableGridY={true}
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No health data available yet. Start tracking your vitals!</p>
          </div>
        )}
      </div>
    </div>
  );
}