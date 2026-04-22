"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { StatsCard } from "@/components/Shared/StatsCard";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useGetPopularSubjectsQuery,
  useGetActiveUsersAnalyticsQuery,
} from "@/redux/services/analyticsApi";
import { useGetAllUsersQuery } from "@/redux/services/userApi";

const AnalyticsChart = dynamic(() => import("./AnalyticsChart"), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-slate-50 animate-pulse rounded-2xl" />
});

export default function AnalyticsClient() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d">("7d");

  const { data: usersResponse, isLoading: isUsersLoading } = useGetAllUsersQuery({});
  const { data: popularSubjects, isLoading: isSubjectsLoading } = useGetPopularSubjectsQuery();
  const { data: activeUsersData, isLoading: isActiveUsersLoading } = useGetActiveUsersAnalyticsQuery();

  const totalUsers = usersResponse?.count || 0;

  // Process chart data
  const rawChartData = activeUsersData?.daily_breakdown || [];
  const processedChartData = rawChartData.map((item) => ({
    date: new Date(item.day).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    activeUsers: item.active_users,
  }));

  // Process subjects data
  const maxScanCount = Math.max(...(popularSubjects?.map((s) => s.scan_count) || [1]), 1);
  const processedSubjects = (popularSubjects || []).map((s, index) => ({
    rank: index + 1,
    name: s.subject.charAt(0).toUpperCase() + s.subject.slice(1),
    views: s.scan_count,
    percent: (s.scan_count / maxScanCount) * 100,
  }));

  const isLoading = isUsersLoading || isSubjectsLoading || isActiveUsersLoading;

  if (isLoading) {
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
            value={totalUsers.toString()}
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

            <AnalyticsChart data={processedChartData} />
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
              {processedSubjects.map((subject, index) => {
                // Interpolate from #6366F1 (99, 102, 241) to #C7D2FE (199, 210, 254)
                const total = processedSubjects.length;
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
