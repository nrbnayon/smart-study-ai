/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, any> | null;
}

export default function DetailsModal({
  isOpen,
  onClose,
  title,
  data,
}: DetailsModalProps) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full text-secondary transition-colors cursor-pointer hover:text-red-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[90vh] overflow-y-auto">
          {Object.entries(data).map(([key, value]) => {
            if (key === "id" || key === "avatar") return null;

            const isStatus = key.toLowerCase() === "status";
            const s = isStatus ? String(value).toLowerCase() : "";

            return (
              <div
                key={key}
                className="flex flex-col gap-1 border-b border-gray-50 pb-3 last:border-0"
              >
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
                {isStatus ? (
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
                      {value}
                    </span>
                  </div>
                ) : (
                  <span className="text-base font-medium text-foreground">
                    {typeof value === "string" ? value : JSON.stringify(value)}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end px-6 py-4 bg-gray-50/50">
          <button
            onClick={onClose}
            aria-label="Close"
            className="px-6 py-2.5 bg-destructive text-white font-semibold rounded-xl hover:bg-destructive/90 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
