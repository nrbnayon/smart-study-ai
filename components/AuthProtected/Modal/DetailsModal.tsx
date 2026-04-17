/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { X } from "lucide-react";

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
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-[#1E293B]">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {Object.entries(data).map(([key, value]) => {
            if (key === "id" || key === "avatar") return null;
            return (
              <div key={key} className="flex flex-col gap-1 border-b border-gray-50 pb-3 last:border-0">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <span className="text-base font-medium text-[#1E293B]">
                  {typeof value === "string" ? value : JSON.stringify(value)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end p-6 bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#1E293B] text-white font-semibold rounded-xl hover:bg-[#0F1430] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
