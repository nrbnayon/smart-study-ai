/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Crown, Search, Filter } from "lucide-react";
import Image from "next/image";
import AddEditUserModal from "@/components/AuthProtected/Modal/AddEditUserModal";
import EditFeaturesModal from "@/components/AuthProtected/Modal/EditFeaturesModal";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { DynamicTable } from "@/components/Shared/DynamicTable";
import { TableColumn } from "@/types/table.types";
import { SubscriptionCard } from "./SubscriptionCard";
import { toast } from "sonner";
import { useGetAllUsersQuery } from "@/redux/services/userApi";
import { resolveMediaUrl } from "@/lib/utils";
import { User } from "@/types/users";
import { TableSkeleton } from "@/components/Skeleton/TableSkeleton";

const PLAN_FEATURES = {
  Basic: [
    { id: "1", name: "Access to free subjects", included: true },
    { id: "2", name: "Download notes", included: false },
    { id: "3", name: "Ad-free experience", included: false },
    { id: "4", name: "Live sessions", included: false },
    { id: "5", name: "Practice tests (limited)", included: true },
  ],
  Premium: [
    { id: "1", name: "Access to all subjects", included: true },
    { id: "2", name: "Download notes", included: true },
    { id: "3", name: "Ad-free experience", included: true },
    { id: "4", name: "Live sessions", included: true },
    { id: "5", name: "Practice tests (unlimited)", included: true },
  ],
};

export default function SubscriptionsClient() {
  const [activePlanModal, setActivePlanModal] = useState<
    "Basic" | "Premium" | null
  >(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [plans, setPlans] = useState(PLAN_FEATURES);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: userResponse, isLoading: isUsersLoading } = useGetAllUsersQuery({
    search,
    page: currentPage,
  });

  const allUsers = userResponse?.results || [];
  const totalCount = userResponse?.count || 0;

  // Calculate plan-specific subscribers from the current page/list
  const basicCount = allUsers.filter((u) => u.subscription_status === "monthly")
    .length;
  const premiumCount = allUsers.filter(
    (u) => u.subscription_status === "yearly",
  ).length;

  const handleEditFeatures = (planName: "Basic" | "Premium") => {
    setActivePlanModal(planName);
  };

  const handleSaveFeatures = async (newFeatures: any[]) => {
    if (activePlanModal) {
      setIsSaving(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      setPlans((prev) => ({ ...prev, [activePlanModal]: newFeatures }));
      setIsSaving(false);
      setActivePlanModal(null);
      toast.success(`${activePlanModal} plan features updated`);
    }
  };

  const handleChangePlan = (user: User) => {
    setSelectedUser(user);
    setIsEditUserModalOpen(true);
  };

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
          <span className="font-semibold text-foreground">{name || "Unnamed"}</span>
        </div>
      ),
    },
    {
      key: "email",
      header: "EMAIL",
      className: "text-secondary text-sm font-medium",
    },
    {
      key: "subscription_status",
      header: "CURRENT PLAN",
      render: (status: string) => {
        const isPremium = status === "monthly" || status === "yearly" || status === "Premium";
        return isPremium ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/5 text-primary text-xs font-bold border border-primary/10">
            <Crown size={12} className="fill-primary/10" /> {status}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 text-secondary text-xs font-bold border border-gray-100">
            {status || "Basic"}
          </span>
        );
      },
    },
    {
      key: "signup_date",
      header: "START DATE",
      className: "text-secondary text-sm font-medium",
      render: (date: string) =>
        new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      key: "expiry_date",
      header: "EXPIRY DATE",
      render: (expiryDate: string) => (
        <span className="text-secondary text-sm font-medium">
          {expiryDate || "—"}
        </span>
      ),
    },
    {
      key: "account_status",
      header: "STATUS",
      render: (status: string) => {
        const isActive = status === "verified";
        if (!isActive) {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-50 text-red-500 text-xs font-bold">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Inactive
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-500 text-xs font-bold">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active
          </span>
        );
      },
    },
  ];

  const tableActions = [
    {
      label: "Change Plan",
      onClick: (row: any) => handleChangePlan(row),
      render: () => (
        <span className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-foreground font-bold text-xs transition-all">
          Change Plan
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col pb-10 animate-fade-in">
      <DashboardHeader
        title="Subscriptions"
        description="Manage your subscription plans and subscribers."
      />

      <div className="p-4 md:p-6 space-y-8">
        {/* Plan Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          <SubscriptionCard
            planType="Basic"
            subscribersCount={basicCount}
            features={plans.Basic}
            onEditFeatures={handleEditFeatures}
          />

          <SubscriptionCard
            planType="Premium"
            subscribersCount={premiumCount}
            features={plans.Premium}
            onEditFeatures={handleEditFeatures}
            price="$9.99"
          />
        </div>

        {/* Subscriber List Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Subscriber List
              </h3>
              <p className="text-sm text-secondary font-medium">
                {totalCount} total subscribers
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search subscribers..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:border-primary w-full md:w-64"
                />
              </div>
              <button className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-secondary transition-all cursor-pointer">
                <Filter size={20} />
              </button>
            </div>
          </div>

          {isUsersLoading ? (
            <TableSkeleton rowCount={8} />
          ) : (
            <DynamicTable
              data={allUsers}
              config={{
                columns,
                showActions: true,
                actionsLabel: "ACTION",
                actions: tableActions as any,
              }}
              pagination={{
                enabled: true,
                pageSize: 10,
                total: totalCount,
                currentPage: currentPage,
              }}
              onPageChange={setCurrentPage}
              className="border-none shadow-none"
              headerClassName="!bg-[#F8FAFC] !text-secondary font-bold text-sm border-t border-b border-gray-100 uppercase tracking-wider"
              rowClassName="hover:bg-gray-50/50 border-b border-gray-50 last:border-0 transition-colors"
            />
          )}
        </div>
      </div>

      <EditFeaturesModal
        isOpen={activePlanModal !== null}
        onClose={() => setActivePlanModal(null)}
        onSave={handleSaveFeatures}
        planName={activePlanModal || ""}
        initialFeatures={activePlanModal ? plans[activePlanModal] : []}
        isLoading={isSaving}
      />

      <AddEditUserModal
        isOpen={isEditUserModalOpen}
        onClose={() => setIsEditUserModalOpen(false)}
        onConfirm={(data) => {
          console.log("Updated plan for user:", data);
        }}
        title="Change Plan"
        user={selectedUser}
      />
    </div>
  );
}
