import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardSkeleton = () => {
  return (
    <div className="flex h-screen w-full bg-[#0F1430] overflow-hidden">
      {/* Sidebar Skeleton */}
      <div className="w-[290px] h-full bg-[#121833] flex flex-col p-6 gap-8 border-r border-[#222A4D]">
        {/* Logo area */}
        <div className="flex justify-center py-4">
          <Skeleton className="h-10 w-32 bg-[#222A4D]" />
        </div>

        {/* Navigation items */}
        <div className="flex flex-col gap-4 flex-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2">
              <Skeleton className="h-6 w-6 rounded-lg bg-[#222A4D]" />
              <Skeleton className="h-4 w-32 bg-[#222A4D]" />
            </div>
          ))}
          
          <div className="pt-4 mt-4 border-t border-[#222A4D]">
            <Skeleton className="h-3 w-20 mb-4 bg-[#222A4D]" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2">
                <Skeleton className="h-6 w-6 rounded-lg bg-[#222A4D]" />
                <Skeleton className="h-4 w-28 bg-[#222A4D]" />
              </div>
            ))}
          </div>
        </div>

        {/* User profile area */}
        <div className="pt-4 border-t border-[#222A4D] flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full bg-[#222A4D]" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24 bg-[#222A4D]" />
            <Skeleton className="h-3 w-16 bg-[#222A4D]" />
          </div>
          <Skeleton className="h-5 w-5 bg-[#222A4D]" />
        </div>
      </div>

      {/* Main Content Area Skeleton */}
      <div className="flex-1 bg-background flex flex-col">
        {/* Top Navbar Skeleton if any, otherwise just content padding */}
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-[32px] border border-gray-100 shadow-sm" />
            ))}
          </div>

          {/* Main Content Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-[400px] w-full rounded-[32px] border border-gray-100" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-[190px] w-full rounded-[32px] border border-gray-100" />
              <Skeleton className="h-[190px] w-full rounded-[32px] border border-gray-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
