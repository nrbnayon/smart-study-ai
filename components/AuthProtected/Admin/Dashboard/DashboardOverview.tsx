/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import Link from "next/link";
import { TableColumn } from "@/types/table.types";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { Users, Crown, ArrowUpRight } from "lucide-react";
import { DynamicTable } from "@/components/Shared/DynamicTable";
import { StatsCard } from "@/components/Shared/StatsCard";
import { recentUsers } from "@/data/dashboardDummyData";
import DetailsModal from "@/components/AuthProtected/Modal/DetailsModal";
import { cn } from "@/lib/utils";
import Image from "next/image";

const DashboardOverview = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: TableColumn<(typeof recentUsers)[0]>[] = [
    {
      key: "name",
      header: "NAME",
      render: (name: string, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F1F5F9] border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
            {row.avatar ? (
              <Image
                src={row.avatar}
                alt={name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/avatar.png";
                }}
              />
            ) : (
              <span className="text-[#6366F1] font-bold text-sm uppercase">
                {name.substring(0, 2)}
              </span>
            )}
          </div>
          <span className="font-semibold text-foreground">{name}</span>
        </div>
      ),
    },
    {
      key: "email",
      header: "EMAIL",
      className: "text-[#64748B]",
    },
    {
      key: "signupDate",
      header: "SIGNUP DATE",
      className: "text-foreground",
    },
    {
      key: "status",
      header: "STATUS",
      render: (status: string) => {
        const s = status.toLowerCase();
        return (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                s === "active"
                  ? "bg-[#10B981]"
                  : s === "pending"
                    ? "bg-[#F59E0B]"
                    : "bg-gray-300",
              )}
            />
            <span
              className={cn(
                "text-sm font-medium capitalize",
                s === "active"
                  ? "text-[#10B981]"
                  : s === "pending"
                    ? "text-[#F59E0B]"
                    : "text-gray-400",
              )}
            >
              {status}
            </span>
          </div>
        );
      },
    },
  ];

  const tableConfig = {
    columns,
    showActions: true,
    actionsLabel: "ACTION",
    actions: [
      {
        label: "View",
        onClick: (row: any) => {
          setSelectedUser(row);
          setIsModalOpen(true);
        },
        className: "text-primary font-medium hover:underline",
        render: () => (
          <span className="text-primary font-medium hover:underline cursor-pointer">
            View
          </span>
        ),
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col pb-10">
      <DashboardHeader
        title="Dashboard"
        description="Welcome Back! Here's what's happening with your platform."
      />

      <div className="p-4 md:p-8 space-y-8">
        {/* Stats Cards - Only 2 as per Image 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsCard
            title="Total Users"
            value="25"
            icon={Users}
            iconBgColor="#EEF2FF"
            iconColor="#6366F1"
            subtitle="+12%"
            isUp={true}
          />
          <StatsCard
            title="Subscribed User"
            value="20"
            icon={Crown}
            iconBgColor="#FFFBEB"
            iconColor="#E17100"
            subtitle="+8%"
            isUp={true}
          />
        </div>

        {/* Recent Registrations Table */}
        <div className="bg-white rounded-2xl border border-gray-100 flex flex-col shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between px-4 pt-6 pb-2">
            <h3 className="text-xl font-bold text-foreground">
              Recent User Registrations
            </h3>
            <Link
              href="/users"
              className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              View all
              <ArrowUpRight size={16} />
            </Link>
          </div>
          <DynamicTable
            data={recentUsers}
            config={tableConfig}
            pagination={{ enabled: true, pageSize: 10 }}
            className="border-none shadow-[0px_6px_54px_0px_rgba(0,0,0,0.05)]"
            headerClassName="!bg-[#F8FAFC] !text-secondary font-bold text-sm border-t border-b border-gray-100 uppercase tracking-wider"
            rowClassName="hover:bg-gray-50/50 border-b border-gray-50 last:border-0 transition-colors"
          />
        </div>
      </div>

      <DetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="User Registration Details"
        data={selectedUser}
      />
    </div>
  );
};

export default DashboardOverview;
