"use client";

import { useState } from "react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { User, Shield, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import ProfileTab from "./ProfileTab";
import SecurityTab from "./SecurityTab";
import FAQManagerTab from "./FAQManagerTab";

export default function SettingsClient() {
  const [activeTab, setActiveTab] = useState<
    "Profile" | "Security" | "FAQ Manager"
  >("Profile");

  return (
    <div className="min-h-screen flex flex-col pb-10 animate-fade-in">
      <DashboardHeader title="Settings" />

      <div className="p-4 md:p-6 lg:p-10 space-y-6 max-w-5xl mx-auto w-full mt-4">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)] p-1.5 flex items-center justify-between gap-1 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab("Profile")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-base transition-all whitespace-nowrap cursor-pointer",
              activeTab === "Profile"
                ? "bg-primary text-white shadow-md shadow-indigo-500/20"
                : "text-secondary hover:bg-gray-50 hover:text-foreground",
            )}
          >
            <User size={18} />
            Profile
          </button>
          <button
            onClick={() => setActiveTab("Security")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-base transition-all whitespace-nowrap cursor-pointer",
              activeTab === "Security"
                ? "bg-primary text-white shadow-md shadow-indigo-500/20"
                : "text-secondary hover:bg-gray-50 hover:text-foreground",
            )}
          >
            <Shield size={18} />
            Security
          </button>
          <button
            onClick={() => setActiveTab("FAQ Manager")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-base transition-all whitespace-nowrap cursor-pointer",
              activeTab === "FAQ Manager"
                ? "bg-primary text-white shadow-md shadow-indigo-500/20"
                : "text-secondary hover:bg-gray-50 hover:text-foreground",
            )}
          >
            <HelpCircle size={18} />
            FAQ Manager
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === "Profile" && <ProfileTab />}
          {activeTab === "Security" && <SecurityTab />}
          {activeTab === "FAQ Manager" && <FAQManagerTab />}
        </div>
      </div>
    </div>
  );
}
