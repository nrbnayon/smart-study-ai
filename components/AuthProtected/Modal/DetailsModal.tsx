/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
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
  return (
    <AnimatePresence>
      {isOpen && data && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-[4px]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-lg bg-white rounded-[24px] shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-50 bg-[#FDFDFF]">
              <h3 className="text-xl font-bold text-[#1E293B]">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-4 max-h-[70vh] overflow-y-auto">
              {Object.entries(data).map(([key, value]) => {
                if (key === "id" || key === "avatar") return null;

                const isStatus = key.toLowerCase() === "status";
                const s = isStatus ? String(value).toLowerCase() : "";

                return (
                  <div
                    key={key}
                    className="flex flex-col gap-1.5 border-b border-gray-50 pb-4 last:border-0"
                  >
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    {isStatus ? (
                      <div className="flex items-center gap-2 pl-1">
                        <span
                          className={cn(
                            "w-2 h-2 rounded-full",
                            s === "active"
                              ? "bg-primary"
                              : s === "pending"
                                ? "bg-primary/50"
                                : "bg-gray-300",
                          )}
                        />
                        <span
                          className={cn(
                            "text-sm font-bold capitalize",
                            s === "active"
                              ? "text-primary"
                              : s === "pending"
                                ? "text-primary/70"
                                : "text-gray-400",
                          )}
                        >
                          {String(value)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-base font-semibold text-[#1E293B] pl-1">
                        {typeof value === "string"
                          ? value
                          : JSON.stringify(value)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end p-6 bg-gray-50 border-t border-gray-50">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-destructive text-white font-bold rounded-xl hover:bg-destructive/90 transition-all shadow-lg shadow-gray-200 cursor-pointer active:scale-95"
              >
                Close Details
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
