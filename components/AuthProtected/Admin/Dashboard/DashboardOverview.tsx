"use client";
import { useState } from "react";
import Link from "next/link";
import { TableColumn } from "@/types/table.types";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { Users, Crown, ArrowUpRight, UserCheck, BookOpen } from "lucide-react";
import { DynamicTable } from "@/components/Shared/DynamicTable";
import { StatsCard } from "@/components/Shared/StatsCard";
import DetailsModal from "@/components/AuthProtected/Modal/DetailsModal";
import { cn, resolveMediaUrl } from "@/lib/utils";
import Image from "next/image";
import { useGetDashboardQuery } from "@/redux/services/dashboardApi";
import { useGetAllUsersQuery } from "@/redux/services/userApi";
import { TableSkeleton } from "@/components/Skeleton/TableSkeleton";
import { User } from "@/types/users";

const DashboardOverview = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: dashboardData, isLoading: isDashboardLoading } =
    useGetDashboardQuery();
  const { data: usersData, isLoading: isUsersLoading } = useGetAllUsersQuery({
    page: 1,
  });

  const { data: activeUsersData, isLoading: isActiveUsersLoading } =
    useGetAllUsersQuery({ account_status: "verified" });
  const { data: basicSubscribersData, isLoading: isBasicSubscribersLoading } =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useGetAllUsersQuery({ subscription_status: "monthly" } as any);
  const { data: premiumSubscribersData, isLoading: isPremiumSubscribersLoading } =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useGetAllUsersQuery({ subscription_status: "yearly" } as any);

  const stats = dashboardData;
  const recentUsers = usersData?.results?.slice(0, 7) || [];

  const columns: TableColumn<User>[] = [
    {
      key: "name",
      header: "NAME",
      render: (name: string, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
            {row.image ? (
              <Image
                src={resolveMediaUrl(row.image)}
                alt={name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-primary font-bold text-sm uppercase">
                {name?.substring(0, 2) || "U"}
              </span>
            )}
          </div>
          <span className="font-semibold text-foreground">
            {name || "Unnamed"}
          </span>
        </div>
      ),
    },
    {
      key: "email",
      header: "EMAIL",
      className: "text-secondary",
    },
    {
      key: "signup_date",
      header: "SIGNUP DATE",
      className: "text-secondary",
      sortable: true,
      render: (date: string) =>
        new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      key: "account_status",
      header: "STATUS",
      render: (status: string) => {
        const isActive = status === "verified";
        return (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                isActive ? "bg-[#10B981]" : "bg-gray-300",
              )}
            />
            <span
              className={cn(
                "text-sm font-medium capitalize",
                isActive ? "text-[#10B981]" : "text-gray-400",
              )}
            >
              {isActive ? "Active" : "Inactive"}
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
        onClick: (row: User) => {
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

      <div className="p-4 md:p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value={isDashboardLoading ? "..." : String(stats?.total_users || 0)}
            icon={Users}
            iconBgColor="#EEF2FF"
            iconColor="#6366F1"
            // subtitle="Overall registered users"
            isUp={true}
          />
          <StatsCard
            title="Active Users"
            value={
              isActiveUsersLoading ? "..." : String(activeUsersData?.count || 0)
            }
            icon={UserCheck}
            iconBgColor="#ECFDF5"
            iconColor="#009966"
            // subtitle={
            //   stats?.subscription_note || "Currently active subscriptions"
            // }
            isUp={true}
          />
          <StatsCard
            title="Premium Subscribers"
            value={
              isPremiumSubscribersLoading
                ? "..."
                : String(premiumSubscribersData?.count || 0)
            }
            icon={Crown}
            iconBgColor="#FFFBEB"
            iconColor="#E17100"
            // subtitle={
            //   stats?.subscription_note || "Currently active subscriptions"
            // }
            isUp={true}
          />
          <StatsCard
            title="Basic Subscribers"
            value={
              isBasicSubscribersLoading
                ? "..."
                : String(basicSubscribersData?.count || 0)
            }
            icon={BookOpen}
            iconBgColor="#EFF6FF"
            iconColor="#155DFC"
            // subtitle={
            //   stats?.subscription_note || "Currently active subscriptions"
            // }
            isUp={true}
          />
        </div>

        {/* Recent Registrations Table */}
        <div className="bg-white rounded-2xl border border-gray-100 flex flex-col shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between px-4 py-5">
            <h3 className="text-xl font-bold text-foreground">
              Recent User Registrations
            </h3>
            <Link
              href="/user-management"
              className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              View all
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {isUsersLoading ? (
            <TableSkeleton rowCount={5} />
          ) : (
            <DynamicTable
              data={recentUsers}
              config={tableConfig}
              pagination={{ enabled: false, pageSize: 5 }}
              className="border-none shadow-none"
              headerClassName="!bg-[#F8FAFC] !text-secondary font-bold text-sm border-t border-b border-gray-100 uppercase tracking-wider"
              rowClassName="hover:bg-gray-50/50 border-b border-gray-50 last:border-0 transition-colors"
            />
          )}
        </div>
      </div>

      <DetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="User Registration Details"
        data={
          selectedUser
            ? {
                Name: selectedUser.name,
                Email: selectedUser.email,
                "Account Status": selectedUser.account_status,
                "Subscription Status": selectedUser.subscription_status,
                "Joined Date": new Date(
                  selectedUser.signup_date,
                ).toLocaleDateString(),
                avatar: selectedUser.image
                  ? resolveMediaUrl(selectedUser.image)
                  : null,
              }
            : null
        }
      />
    </div>
  );
};

export default DashboardOverview;
