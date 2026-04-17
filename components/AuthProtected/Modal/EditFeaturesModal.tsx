/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EditFeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (features: any) => void;
  planName: string;
  initialFeatures: any[];
}

export default function EditFeaturesModal({
  isOpen,
  onClose,
  onSave,
  planName,
  initialFeatures,
}: EditFeaturesModalProps) {
  const [features, setFeatures] = useState<any[]>(initialFeatures);
  const [prevInitialFeatures, setPrevInitialFeatures] =
    useState(initialFeatures);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen || initialFeatures !== prevInitialFeatures) {
    setPrevIsOpen(isOpen);
    setPrevInitialFeatures(initialFeatures);
    if (isOpen) {
      setFeatures(initialFeatures);
    }
  }

  const toggleFeature = (id: string) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, included: !f.included } : f)),
    );
  };

  const handleSave = () => {
    onSave(features);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-foreground">
                  Edit {planName} Features
                </h3>
                <p className="text-sm text-secondary font-medium">
                  Toggle features to update the plan
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-gray-50 hover:bg-red-50 rounded-full text-secondary hover:text-red-500 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-3">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  onClick={() => toggleFeature(feature.id)}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                    feature.included
                      ? "border-primary bg-primary/5"
                      : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <span
                    className={`text-sm font-semibold ${
                      feature.included ? "text-foreground" : "text-secondary"
                    }`}
                  >
                    {feature.name}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                      feature.included
                        ? "bg-primary border-primary text-white"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    {feature.included && <Check size={14} strokeWidth={3} />}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 bg-[#F8FAFC] border-t border-gray-100 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-white border border-gray-200 text-secondary font-bold rounded-xl hover:bg-gray-50 transition-all cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer active:scale-95 text-sm"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
