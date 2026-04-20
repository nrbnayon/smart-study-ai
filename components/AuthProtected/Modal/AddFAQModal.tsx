"use client";

import { useState } from "react";
import { X, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface FAQData {
  id?: string;
  question: string;
  answer: string;
}

interface AddFAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FAQData) => void;
  initialData?: FAQData | null;
  isLoading?: boolean;
}

export default function AddFAQModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isLoading,
}: AddFAQModalProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      if (initialData) {
        setQuestion(initialData.question);
        setAnswer(initialData.answer);
      } else {
        setQuestion("");
        setAnswer("");
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    onSave({ id: initialData?.id, question, answer });
  };

  const isEditing = !!initialData;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLoading ? undefined : onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 overflow-y-auto w-full"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-[24px] shadow-2xl z-50 flex flex-col p-8"
          >
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {isEditing ? "Edit FAQ" : "Add New FAQ"}
                </h2>
                <p className="text-sm font-medium text-secondary mt-1">
                  Fill in the question and its answer
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600 rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-base font-bold text-foreground block">
                  Question <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <HelpCircle
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-gray-100 rounded-xl text-base font-medium text-foreground focus:bg-white focus:outline-none focus:border-primary transition-all disabled:opacity-60"
                    placeholder="e.g. How do I reset my password?"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-base font-bold text-foreground block">
                  Answer <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  required
                  rows={4}
                  disabled={isLoading}
                  className="w-full p-4 bg-[#F8FAFC] border border-gray-100 rounded-xl text-base font-medium text-foreground focus:bg-white focus:outline-none focus:border-primary transition-all resize-none disabled:opacity-60"
                  placeholder="Provide a clear and helpful answer..."
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="w-1/2 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-foreground rounded-xl font-bold text-base transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !question.trim() || !answer.trim()}
                  className="w-1/2 py-3 bg-primary hover:bg-primary text-white rounded-xl font-bold text-base transition-all cursor-pointer shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    isEditing ? "Save Changes" : "Add FAQ"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
