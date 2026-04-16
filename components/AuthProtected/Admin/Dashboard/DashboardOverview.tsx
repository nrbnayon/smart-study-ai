"use client";

import { TableColumn } from "@/types/table.types";
import Image from "next/image";
import { RecentActivity, DashboardResponse } from "@/redux/services/dashboardApi";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { Users, MapPin, FileText, Image as ImageIcon, AlertCircle } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { DynamicTable } from "@/components/Shared/DynamicTable";
import { StatsCard } from "@/components/Shared/StatsCard";
import { StatsSkeleton } from "@/components/Skeleton/StatsSkeleton";
import { TableSkeleton } from "@/components/Skeleton/TableSkeleton";
import { ChartSkeleton } from "@/components/Skeleton/ChartSkeleton";
import { useGetDashboardQuery } from "@/redux/services/dashboardApi";

const DashboardOverview = () => {
  const { data: dashboardData, isLoading, isError, refetch } = useGetDashboardQuery();
  const Icon = AlertCircle;

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col pt-32 items-center bg-[#FDFDFF] px-4">
        <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] border border-red-50/50 shadow-2xl shadow-red-500/5 text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="relative mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
            <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20" />
            <Icon className="w-10 h-10 text-red-500 relative z-10" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              Oops! Connection Lost
            </h2>
            <p className="text-secondary font-medium leading-relaxed">
              We couldn&apos;t fetch your dashboard statistics at this moment. 
              Please check your network or try again.
            </p>
          </div>

          <button
            onClick={() => refetch()}
            className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Pre-destructure safely with fallbacks
  const { 
    stats = {} as DashboardResponse['stats'], 
    userActivity = [], 
    reportsSubmitted = [], 
    recentActivity = [] 
  } = (dashboardData || {}) as DashboardResponse;

  const activityColumns: TableColumn<RecentActivity>[] = [
    {
      key: "user",
      header: "User",
      render: (user: { name: string; avatar?: string }) => {
        const userName = user?.name || 'User';
        const userAvatar = user?.avatar || '';

        return (
          <div className="flex items-center gap-3 py-1">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 border border-gray-200 overflow-hidden relative">
              {userAvatar ? (
                <Image
                  src={userAvatar}
                  alt={userName}
                  fill
                  className="object-cover"
                  unoptimized
                  onError={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.display = 'none';
                  }}
                />
              ) : null}
            </div>
            <span className="font-medium text-foreground">{userName}</span>
          </div>
        );
      },
    },
    {
      key: "action",
      header: "Action",
      render: (action: string) => (
        <span className="text-gray-600 font-medium">{action}</span>
      ),
    },
    {
      key: "lake",
      header: "Lake",
      render: (lake: string) => (
        <span className="text-gray-500 font-medium">{lake}</span>
      ),
    },
    {
      key: "time",
      header: "Time",
      render: (time: string) => (
        <span className="text-secondary font-medium">{time}</span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex flex-col pb-10">
      <DashboardHeader
        title="Dashboard"
        description="Welcome Back! Here's what's happening with your platform."
      />

      <div className="p-6 space-y-8 w-full mx-auto">
        {isLoading ? (
          <StatsSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatsCard
              title="Total Users"
              value={stats.totalUsers?.value.toLocaleString()}
              icon={Users}
              iconBgColor="#F3F4F6"
              iconColor="#6B7280"
              subtitle={`${stats.totalUsers?.trend >= 0 ? "+" : ""}${stats.totalUsers?.trend} vs last month`}
              isUp={stats.totalUsers?.trend >= 0}
            />
            <StatsCard
              title="Total Lakes"
              value={stats.totalLakes?.value.toLocaleString()}
              icon={MapPin}
              iconBgColor="#DCFCE7"
              iconColor="#22C55E"
              subtitle={`${stats.totalLakes?.trend >= 0 ? "+" : ""}${stats.totalLakes?.trend} vs last month`}
              isUp={stats.totalLakes?.trend >= 0}
            />
            <StatsCard
              title="Reports"
              value={stats.totalReports?.value.toLocaleString()}
              icon={FileText}
              iconBgColor="#FFEDD5"
              iconColor="#F97316"
              subtitle={`${stats.totalReports?.trend >= 0 ? "+" : ""}${stats.totalReports?.trend} New this month`}
              isUp={stats.totalReports?.trend >= 0}
            />
            <StatsCard
              title="BassPorn Request"
              value={stats.bassPornRequests?.value.toLocaleString()}
              icon={ImageIcon}
              iconBgColor="#CFFAFE"
              iconColor="#06B6D4"
              subtitle={`${stats.bassPornRequests?.trend >= 0 ? "+" : ""}${stats.bassPornRequests?.trend} Pending requests`}
              isUp={stats.bassPornRequests?.trend >= 0}
            />
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Activity Chart */}
          <div className="bg-white p-6 rounded-2xl border border-primary/10 space-y-6">
            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-foreground">
                User Activity
              </h3>
              <p className="text-sm text-secondary font-medium">
                Weekly active users
              </p>
            </div>
            <div className="h-[300px] w-full">
              {isLoading ? (
                <ChartSkeleton />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={userActivity}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorUsers"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#FB923C"
                          stopOpacity={0.1}
                        />
                        <stop
                          offset="95%"
                          stopColor="#FB923C"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#F1F5F9"
                    />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 500 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 500 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke="#FB923C"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorUsers)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Reports Submitted Chart */}
          <div className="bg-white p-6 rounded-2xl border border-primary/10 space-y-6">
            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-foreground">
                Reports Submitted
              </h3>
              <p className="text-sm text-secondary font-medium">
                Weekly reports submissions
              </p>
            </div>
            <div className="h-[300px] w-full">
              {isLoading ? (
                <ChartSkeleton />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={reportsSubmitted}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#F1F5F9"
                    />
                    <XAxis
                      dataKey="week"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 500 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 500 }}
                    />
                    <Tooltip
                      cursor={{ fill: "#F8FAFC" }}
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="reports"
                      fill="#FB923C"
                      radius={[6, 6, 0, 0]}
                      barSize={60}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="space-y-4">
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-foreground">
              Recent Activity
            </h3>
            <p className="text-sm text-secondary font-medium">
              Latest user actions and Lakes
            </p>
          </div>

          <div className="overflow-hidden bg-white rounded-2xl border border-primary/10 p-4 min-h-[300px]">
            {isLoading ? (
              <TableSkeleton rowCount={8} />
            ) : (
              <DynamicTable
                data={recentActivity}
                config={{
                  columns: activityColumns,
                }}
                loading={false}
                pagination={{ enabled: false }}
                className="border-none shadow-none"
                headerClassName="!bg-white !text-gray-500 font-semibold border-b border-gray-50 uppercase text-[11px] tracking-wider"
                rowClassName="hover:bg-gray-50/50 border-b border-gray-100 last:border-0 transition-colors"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
