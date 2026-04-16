"use client";

import { useState } from "react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import SearchBar from "@/components/Shared/SearchBar";
import { DynamicTable } from "@/components/Shared/DynamicTable";
import { TablePagination } from "@/components/Shared/TablePagination";
import {
  useGetAllUsersQuery,
  useUpdateUserByIdMutation,
  PaginatedApiResponse,
} from "@/redux/services/userApi";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { User } from "@/types/users";
import Image from "next/image";
import { TableColumn } from "@/types/table.types";

function UserStatusDropdown({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const [updateUser, { isLoading }] = useUpdateUserByIdMutation();

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateUser({ id: user._id, status: newStatus }).unwrap();
      setIsOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(
        "Failed to update status:",
        err?.data?.message || err?.message || err,
      );
    }
  };

  const statuses = [
    {
      label: "Suspended",
      value: "suspended",
      bg: "bg-[#FFE73580] cursor-pointer",
      text: "text-[#EAB308]",
    },
    {
      label: "Active",
      value: "active",
      bg: "bg-[#22C55E33] cursor-pointer",
      text: "text-[#22C55E]",
    },
    {
      label: "Banned",
      value: "banned",
      bg: "bg-[#DF141426] cursor-pointer",
      text: "text-[#DF1414]",
    },
  ];

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center cursor-pointer"
        aria-label="More actions"
      >
        <MoreVertical className="w-5 h-5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-[1.25rem] shadow-[0px_8px_24px_-4px_rgba(10,13,18,0.08),0px_2px_4px_-2px_rgba(10,13,18,0.03)] z-50 p-3 flex flex-col items-center">
          <div className="w-full text-[11px] font-semibold px-2 mb-2 text-[#9CA3AF] text-left">
            Action
          </div>
          <div className="w-full space-y-2">
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => handleStatusChange(status.value)}
                disabled={isLoading}
                className={cn(
                  "w-full flex items-center justify-center py-2 px-3 rounded-full text-xs font-semibold transition-all hover:opacity-80 active:scale-95 disabled:opacity-50",
                  status.bg,
                  status.text,
                  user.status === status.value &&
                    "ring-1 ring-gray-300 ring-offset-1",
                )}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export default function UserManagementClient() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useGetAllUsersQuery({
    search,
    page,
    limit,
    sortBy: "createdAt",
    sortOrder: "desc",
  }) as { data: PaginatedApiResponse<User> | undefined; isLoading: boolean };

  const columns: TableColumn<User>[] = [
    {
      key: "name",
      header: "User",
      render: (_: string, row: User) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-orange-500 overflow-hidden border">
            {row.avatar ? (
              <Image
                src={row.avatar}
                alt={row.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              row.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
            )}
          </div>
          <span className="font-semibold text-foreground">{row.name}</span>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (email: string) => (
        <span className="text-secondary opacity-60">{email}</span>
      ),
    },
    {
      key: "createdAt",
      header: "Join Date",
      render: (date: string) => (
        <span className="font-semibold text-foreground">
          {date ? new Date(date).toISOString().split("T")[0] : "2026-03-01"}
        </span>
      ),
    },
    {
      key: "reports",
      header: "Reports",
      align: "center" as const,
      render: (reports: number) => (
        <span className="text-foreground opacity-70 text-center">
          {reports || 0}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center" as const,
      render: (status: string) => {
        const statusConfig: Record<string, { bg: string; text: string }> = {
          active: { bg: "bg-[#22C55E33]", text: "text-[#22C55E]" },
          suspended: { bg: "bg-[#FFE73580]", text: "text-[#EAB308]" },
          banned: { bg: "bg-[#DF141426]", text: "text-[#DF1414]" },
        };
        const config = statusConfig[status] || {
          bg: "bg-gray-100",
          text: "text-gray-600",
        };
        return (
          <span
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-medium inline-block min-w-[90px] text-center capitalize",
              config.bg,
              config.text,
            )}
          >
            {status}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      align: "center" as const,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, row: User) => <UserStatusDropdown user={row} />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <DashboardHeader
        title="User Management"
        description="Mange platform users and their accounts"
      />

      <div className="p-5 flex flex-col gap-6 w-full mx-auto">
        <div className="bg-white p-6 rounded-xl border border-primary/10 shadow-none">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <SearchBar
              onSearch={setSearch}
              placeholder="Search users by name or email..."
              className="max-w-full bg-white border border-primary/10 rounded-xl"
            />
          </div>

          <div className="overflow-hidden">
            <DynamicTable
              data={data?.data || []}
              config={{
                columns,
                showActions: false, // Using manual actions column
              }}
              loading={isLoading}
              pagination={{ enabled: false }}
              className="border-none shadow-none bg-white rounded-none p-0"
              headerClassName="!bg-white !text-gray-500 font-semibold border-b border-gray-50"
              rowClassName="hover:bg-gray-50/50 border-b border-gray-100 last:border-0 transition-colors"
            />
          </div>

          {!isLoading && data?.pagination && data.pagination.total >= 10 && (
            <div className="pt-8">
              <TablePagination
                currentPage={page}
                totalPages={data.pagination.totalPages}
                totalItems={data.pagination.total}
                itemsPerPage={limit}
                onPageChange={setPage}
                onPageSizeChange={setLimit}
                showPageSize={true}
                pageSizeOptions={[5, 10, 20, 50, 100]}
                className="border-t-0 p-0 "
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
