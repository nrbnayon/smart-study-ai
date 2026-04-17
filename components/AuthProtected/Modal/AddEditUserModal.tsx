/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { X, User, Mail, Shield, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddEditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  title: string;
  user?: any;
}

export default function AddEditUserModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  user,
}: AddEditUserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    plan: "Basic",
    status: "Active",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        plan: user.plan || "Basic",
        status: user.status || "Active",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        plan: "Basic",
        status: "Active",
      });
    }
  }, [user, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(formData);
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#1E293B]">{title}</h3>
                <p className="text-sm text-gray-400 font-medium">
                  Please fill in the user information below.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
                      size={18}
                    />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Yusuf Adams"
                      className="w-full pl-12 pr-4 py-3.5 bg-[#F8FAFC] border border-gray-100 rounded-2xl text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium placeholder:text-gray-300"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
                      size={18}
                    />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. yusuf@example.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-[#F8FAFC] border border-gray-100 rounded-2xl text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Plan */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                      Subscription Plan
                    </label>
                    <div className="relative group">
                      <Shield
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <select
                        name="plan"
                        value={formData.plan}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-[#F8FAFC] border border-gray-100 rounded-2xl text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none appearance-none font-medium text-[#1E293B]"
                      >
                        <option value="Basic">Basic Plan</option>
                        <option value="Premium">Premium Plan</option>
                      </select>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                      Account Status
                    </label>
                    <div className="relative group">
                      <CheckCircle2
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-[#F8FAFC] border border-gray-100 rounded-2xl text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none appearance-none font-medium text-[#1E293B]"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-4 text-gray-400 font-bold rounded-2xl hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex-[2] px-6 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 cursor-pointer active:scale-95"
                >
                  {user ? "Update User Profile" : "Create New User"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
