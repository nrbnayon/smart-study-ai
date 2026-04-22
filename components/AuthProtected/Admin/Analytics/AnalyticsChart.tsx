/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsChartProps {
  data: any[];
}

export default function AnalyticsChart({ data }: AnalyticsChartProps) {
  return (
    <div className="h-[300px] w-full mt-auto min-h-[300px] min-w-0">
      <ResponsiveContainer
        width="100%"
        height="100%"
        minWidth={0}
        minHeight={300}
      >
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: -20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#F1F5F9"
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9CA3AF", fontSize: 12, fontWeight: 500 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9CA3AF", fontSize: 12, fontWeight: 500 }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0px 4px 24px rgba(0,0,0,0.08)",
              fontWeight: 600,
            }}
            cursor={{ stroke: "#E2E8F0", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="activeUsers"
            stroke="#6366F1"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: "#6366F1" }}
            activeDot={{ r: 6, strokeWidth: 0, fill: "#4F46E5" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
