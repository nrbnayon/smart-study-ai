/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Crown, BookOpen, Check, X, Edit3, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { userDummyData } from "@/data/userDummyData";
import AddEditUserModal from "@/components/AuthProtected/Modal/AddEditUserModal";
import EditFeaturesModal from "@/components/AuthProtected/Modal/EditFeaturesModal";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { DynamicTable } from "@/components/Shared/DynamicTable";
import { cn } from "@/lib/utils";
import { TableColumn } from "@/types/table.types";

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
  const [search, setSearch] = useState("");

  const handleEditFeatures = (planName: "Basic" | "Premium") => {
    setActivePlanModal(planName);
  };

  const handleSaveFeatures = (newFeatures: any[]) => {
    if (activePlanModal) {
      setPlans((prev) => ({ ...prev, [activePlanModal]: newFeatures }));
    }
  };

  const handleChangePlan = (user: any) => {
    setSelectedUser(user);
    setIsEditUserModalOpen(true);
  };

  const filteredData = userDummyData.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()),
  );

  const columns: TableColumn<(typeof userDummyData)[0]>[] = [
    {
      key: "name",
      header: "NAME",
      render: (name: string, row) => {
        const hasValidAvatar =
          row.avatar &&
          (row.avatar.startsWith("/") || row.avatar.startsWith("http"));
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
              {hasValidAvatar ? (
                <Image
                  src={row.avatar}
                  alt={name}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-secondary font-bold text-xs uppercase">
                  {name.substring(0, 2)}
                </span>
              )}
            </div>
            <span className="font-bold text-foreground text-sm">{name}</span>
          </div>
        );
      },
    },
    {
      key: "email",
      header: "EMAIL",
      className: "text-secondary text-sm font-medium",
    },
    {
      key: "plan",
      header: "CURRENT PLAN",
      render: (plan: string) =>
        plan === "Premium" ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/5 text-primary text-xs font-bold border border-primary/10">
            <Crown size={12} className="fill-primary/10" /> Premium
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 text-secondary text-xs font-bold border border-gray-100">
            Basic
          </span>
        ),
    },
    {
      key: "joined",
      header: "START DATE",
      className: "text-secondary text-sm font-medium",
    },
    {
      key: "expiryDate",
      header: "EXPIRY DATE",
      render: (expiryDate: string) => (
        <span className="text-secondary text-sm font-medium">
          {expiryDate || "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "STATUS",
      render: (_, row: any) => {
        const isExpired =
          row.expiryDate && new Date(row.expiryDate) < new Date();
        if (isExpired) {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-50 text-red-500 text-xs font-bold">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Expired
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
        <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-foreground font-bold text-xs transition-all cursor-pointer">
          Change Plan
        </button>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Plan */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
          >
            <div className="p-8 pb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-50 rounded-lg text-secondary flex items-center gap-2">
                  <BookOpen size={24} />
                  <h3 className="text-xl font-bold text-foreground">Basic</h3>
                </div>
                <div>
                  <p className="text-sm text-secondary font-medium">
                    Total Subscribers
                  </p>
                  <span className="text-2xl font-bold text-foreground">13</span>
                </div>
              </div>

              <div className="space-y-4 my-6">
                {plans.Basic.map((f) => (
                  <div key={f.id} className="flex items-center gap-3">
                    {f.included ? (
                      <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center">
                        <Check
                          size={12}
                          className="text-green-500"
                          strokeWidth={3}
                        />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center">
                        <X size={12} className="text-red-400" strokeWidth={3} />
                      </div>
                    )}
                    <span
                      className={cn(
                        "text-sm font-medium",
                        f.included
                          ? "text-foreground"
                          : "text-secondary line-through opacity-50",
                      )}
                    >
                      {f.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-auto p-6 pt-0">
              <button
                onClick={() => handleEditFeatures("Basic")}
                className="w-full py-3 bg-white border border-gray-100 rounded-xl text-foreground font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Edit3 size={16} /> Edit Features
              </button>
            </div>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl border-2 border-primary shadow-xl shadow-primary/5 overflow-hidden flex flex-col relative"
          >
            <div className="absolute top-0 right-0 p-8 text-right">
              <p className="text-xs text-secondary font-bold uppercase tracking-wider">
                Price
              </p>
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-2xl font-bold text-foreground">
                  $9.99
                </span>
                <span className="text-sm text-secondary">/month</span>
              </div>
            </div>

            <div className="p-8 pb-4">
              <div className="flex flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary flex items-center gap-2">
                  <Crown size={24} />
                  <h3 className="text-xl font-bold text-foreground">Premium</h3>
                </div>
                <div>
                  <p className="text-sm text-secondary font-medium">
                    Total Subscribers
                  </p>
                  <span className="text-2xl font-bold text-foreground">12</span>
                </div>
              </div>

              <div className="space-y-4 my-6">
                {plans.Premium.map((f) => (
                  <div key={f.id} className="flex items-center gap-3">
                    {f.included ? (
                      <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center">
                        <Check
                          size={12}
                          className="text-green-500"
                          strokeWidth={3}
                        />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center">
                        <X size={12} className="text-red-400" strokeWidth={3} />
                      </div>
                    )}
                    <span className="text-sm font-medium text-foreground">
                      {f.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-auto p-6 pt-0">
              <button
                onClick={() => handleEditFeatures("Premium")}
                className="w-full py-3 bg-white border border-primary/20 rounded-xl text-primary font-bold hover:bg-primary/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Edit3 size={16} /> Edit Features
              </button>
            </div>
          </motion.div>
        </div>

        {/* Subscriber List Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Subscriber List
              </h3>
              <p className="text-sm text-secondary font-medium">
                {filteredData.length} total subscribers
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
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:border-primary w-full md:w-64"
                />
              </div>
              <button className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-secondary transition-all cursor-pointer">
                <Filter size={20} />
              </button>
            </div>
          </div>

          <DynamicTable
            data={filteredData}
            config={{
              columns,
              showActions: true,
              actionsLabel: "ACTION",
              actions: tableActions as any,
            }}
            pagination={{ enabled: true, pageSize: 10 }}
            className="border-none shadow-none"
            headerClassName="!bg-[#F8FAFC] !text-secondary font-bold text-sm border-t border-b border-gray-100 uppercase tracking-wider"
            rowClassName="hover:bg-gray-50/50 border-b border-gray-50 last:border-0 transition-colors"
          />
        </div>
      </div>

      <EditFeaturesModal
        isOpen={activePlanModal !== null}
        onClose={() => setActivePlanModal(null)}
        onSave={handleSaveFeatures}
        planName={activePlanModal || ""}
        initialFeatures={activePlanModal ? plans[activePlanModal] : []}
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
