/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { DynamicTable } from "@/components/Shared/DynamicTable";
import { userDummyData } from "@/data/userDummyData";
import { cn } from "@/lib/utils";
import {
  Eye,
  PencilLine,
  Trash2,
  Plus,
  Search,
  Filter,
  Users,
} from "lucide-react";
import { TableColumn } from "@/types/table.types";
import Image from "next/image";
import DetailsModal from "@/components/AuthProtected/Modal/DetailsModal";

export default function UserManagementClient() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const filterPills = ["All", "Premium", "Basic", "Active", "Inactive"];

  const columns: TableColumn<(typeof userDummyData)[0]>[] = [
    {
      key: "id",
      header: "#",
      className: "text-secondary font-medium",
    },
    {
      key: "name",
      header: "NAME",
      render: (name: string, row) => {
        const hasValidAvatar =
          row.avatar &&
          (row.avatar.startsWith("/") || row.avatar.startsWith("http"));

        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/5 flex items-center justify-center overflow-hidden shrink-0">
              {hasValidAvatar ? (
                <Image
                  src={row.avatar}
                  alt={name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback handled by check, but extra safety
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <span className="text-primary font-bold text-sm uppercase">
                  {name.substring(0, 2)}
                </span>
              )}
            </div>
            <span className="font-semibold text-foreground">{name}</span>
          </div>
        );
      },
    },
    {
      key: "email",
      header: "EMAIL",
      className: "text-secondary",
    },
    {
      key: "plan",
      header: "PLAN",
      render: (plan: string) => (
        <div
          className={cn(
            "px-3 py-1 rounded-lg text-xs font-medium inline-flex items-center gap-1",
            plan === "Premium"
              ? "bg-primary/10 text-primary"
              : "bg-gray-100 text-gray-600",
          )}
        >
          {plan === "Premium" && <span className="text-[10px]">👑</span>}
          {plan}
        </div>
      ),
    },
    {
      key: "status",
      header: "STATUS",
      render: (status: string) => {
        const isActive = status === "Active";
        return (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                isActive ? "bg-primary" : "bg-gray-300",
              )}
            />
            <span
              className={cn(
                "text-sm font-medium capitalize",
                isActive ? "text-primary" : "text-gray-400",
              )}
            >
              {status}
            </span>
          </div>
        );
      },
    },
    {
      key: "joined",
      header: "JOINED",
      className: "text-secondary",
    },
  ];

  const handleOpenDetails = (user: any) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const tableActions = [
    {
      label: "View",
      icon: <Eye size={18} />,
      onClick: (row: any) => handleOpenDetails(row),
      className: "hover:bg-blue-50 text-primary hover:text-primary",
      variant: "primary" as const,
    },
    {
      label: "Edit",
      icon: <PencilLine size={18} />,
      onClick: (row: any) => console.log("Edit", row),
      className: "hover:bg-gray-100 text-gray-400 hover:text-gray-600",
    },
    {
      label: "Delete",
      icon: <Trash2 size={18} />,
      onClick: (row: any) => console.log("Delete", row),
      className: "hover:bg-red-50 text-red-500 hover:text-red-600",
      variant: "danger" as const,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFF]">
      <DashboardHeader title="User Management" />

      <div className="p-4 md:p-6 space-y-6">
        {/* Search and Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)] flex flex-wrap items-center gap-4">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none text-foreground font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="p-3 bg-[#F8FAFC] text-gray-400 rounded-xl hover:bg-gray-100 transition-colors">
              <Filter size={20} />
            </button>

            {/* Filter Pills */}
            <div className="flex items-center gap-2">
              {filterPills.map((pill) => (
                <button
                  key={pill}
                  onClick={() => setActiveFilter(pill)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-semibold transition-all",
                    activeFilter === pill
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-[#F8FAFC] text-gray-500 hover:bg-gray-100",
                  )}
                >
                  {pill}
                </button>
              ))}
            </div>

            <button className="ml-2 flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold transition-all hover:bg-primary/90 active:scale-95 shadow-lg shadow-primary/20">
              <Plus size={20} strokeWidth={3} />
              Add User
            </button>
          </div>
        </div>

        {/* User Table Container */}
        <div className="bg-white rounded-2xl border border-gray-100 flex flex-col shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50">
            <div className="flex items-center gap-2 text-[#64748B]">
              <Users size={18} />
              <span className="text-sm font-semibold">
                {userDummyData.length} users found
              </span>
            </div>
          </div>

          <DynamicTable
            data={userDummyData}
            config={{
              columns,
              showActions: true,
              actionsLabel: "ACTIONS",
              actions: tableActions,
            }}
            pagination={{ enabled: true, pageSize: 10 }}
            className="border-none shadow-none"
            headerClassName="!bg-[#F8FAFC] !text-secondary font-bold text-sm border-t border-b border-gray-100 uppercase tracking-wider"
            rowClassName="hover:bg-gray-50/50 border-b border-gray-50 last:border-0 transition-colors"
          />
        </div>
      </div>

      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="User Details"
        data={selectedUser}
      />
    </div>
  );
}
