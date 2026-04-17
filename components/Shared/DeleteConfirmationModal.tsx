import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = "Delete User",
  description = "Are you sure you want to delete this user? This action cannot be undone.",
}: DeleteConfirmationModalProps & { isLoading?: boolean }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isLoading ? onClose : undefined}
            className="absolute inset-0 bg-black/40 backdrop-blur-[4px]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-md bg-white rounded-[24px] shadow-2xl overflow-hidden"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              disabled={isLoading}
              className="absolute right-4 top-4 p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              <div className="mb-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6 text-red-500 shadow-inner">
                  <HugeiconsIcon
                    icon={Delete02Icon}
                    size={32}
                    strokeWidth={1.5}
                  />
                </div>

                <h3 className="text-2xl font-bold text-[#1E293B]">{title}</h3>
                <p className="mt-3 text-sm text-gray-400 font-medium leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 px-6 py-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  No, Keep it
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center px-6 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold shadow-xl shadow-red-200 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Yes, Delete"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
