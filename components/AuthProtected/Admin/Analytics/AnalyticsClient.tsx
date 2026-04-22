"use client";

import React, { useState } from "react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { StatsCard } from "@/components/Shared/StatsCard";
import { Users } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  userActivityData,
  popularSubjectsData,
} from "@/data/analyticsDummyData";
import { cn } from "@/lib/utils";

export default function AnalyticsClient() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d">("7d");

  // Create extended 30-day dummy data mathematically based on 7d
  const extendedData = [
    { date: "Jan 28", activeUsers: 220 },
    { date: "Feb 1", activeUsers: 260 },
    { date: "Feb 5", activeUsers: 240 },
    { date: "Feb 10", activeUsers: 290 },
    { date: "Feb 15", activeUsers: 330 },
    ...userActivityData,
  ];

  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = timeRange === "7d" ? userActivityData : extendedData;

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col pb-10">
        <DashboardHeader title="Analytics" />
        <div className="p-4 md:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-slate-50 animate-pulse rounded-2xl" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-[400px] bg-slate-50 animate-pulse rounded-2xl" />
            <div className="h-[400px] bg-slate-50 animate-pulse rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-10 animate-fade-in">
      <DashboardHeader title="Analytics" />

      <div className="p-4 md:p-6 space-y-6">
        {/* Stats Cards Row (Only Total Users as requested) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total Users"
            value="25"
            icon={Users}
            iconBgColor="#EEF2FF"
            iconColor="#6366F1"
            subtitle="All registered accounts"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Activity Over Time */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  User Activity Over Time
                </h3>
                <p className="text-sm text-secondary font-medium mt-0.5">
                  Active users per day
                </p>
              </div>
              <div className="flex bg-[#F8FAFC] rounded-lg p-1 border border-gray-100">
                <button
                  onClick={() => setTimeRange("7d")}
                  className={cn(
                    "px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer",
                    timeRange === "7d"
                      ? "bg-white text-foreground shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
                      : "text-secondary hover:text-foreground",
                  )}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setTimeRange("30d")}
                  className={cn(
                    "px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer",
                    timeRange === "30d"
                      ? "bg-white text-foreground shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
                      : "text-secondary hover:text-foreground",
                  )}
                >
                  30 Days
                </button>
              </div>
            </div>

            <div className="h-[300px] w-full mt-auto min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                <LineChart
                  data={chartData}
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
                    ticks={[0, 150, 300, 450, 600]}
                    domain={[0, 600]}
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
          </div>

          {/* Popular Subjects */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)] flex flex-col">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-foreground">
                Popular Subjects
              </h3>
              <p className="text-sm text-secondary font-medium mt-0.5">
                Top subjects by views
              </p>
            </div>

            <div className="flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-hide py-1">
              {popularSubjectsData.map((subject, index) => {
                // Interpolate from #6366F1 (99, 102, 241) to #C7D2FE (199, 210, 254)
                const total = popularSubjectsData.length;
                const ratio = index / Math.max(1, total - 1);
                const r = Math.round(99 + ratio * (199 - 99));
                const g = Math.round(102 + ratio * (210 - 102));
                const b = Math.round(241 + ratio * (254 - 241));

                return (
                  <div key={subject.rank} className="flex items-center gap-4">
                    <span className="text-secondary font-semibold text-sm w-4 shrink-0">
                      {subject.rank}
                    </span>

                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-foreground text-sm">
                          {subject.name}
                        </span>
                        <span className="font-semibold text-secondary text-sm">
                          {subject.views.toLocaleString()}
                        </span>
                      </div>

                      {/* Progress Bar Container */}
                      <div className="w-full h-2.5 bg-[#F8FAFC] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${subject.percent}%`,
                            backgroundColor: `rgb(${r}, ${g}, ${b})`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
