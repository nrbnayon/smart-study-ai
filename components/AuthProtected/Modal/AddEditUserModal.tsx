/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import {
  X,
  User,
  Mail,
  Camera,
  Lock,
  Crown,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn, resolveMediaUrl } from "@/lib/utils";
import { toast } from "sonner";

interface AddEditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: FormData) => void;
  title: string;
  user?: any;
  isLoading?: boolean;
  isSubscriptionOnly?: boolean;
}

export default function AddEditUserModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  user,
  isLoading,
  isSubscriptionOnly = false,
}: AddEditUserModalProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    current_plan: user?.subscription_status || "monthly",
    verified: user?.account_status === "verified",
    image: null as File | null,
    imagePreview: user?.image ? resolveMediaUrl(user.image) : "",
  });

  const [prevUser, setPrevUser] = useState(user);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen || user !== prevUser) {
    setPrevIsOpen(isOpen);
    setPrevUser(user);
    if (isOpen) {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        password: "",
        current_plan: user?.subscription_status || "monthly",
        verified: user ? user.account_status === "verified" : true,
        image: null,
        imagePreview: user?.image ? resolveMediaUrl(user.image) : "",
      });
    }
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Password validation
    if (!user || formData.password) {
      if (formData.password.length < 8) {
        toast.error("Password must be at least 8 characters long");
        return;
      }
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    if (formData.password) data.append("password", formData.password);
    data.append("current_plan", formData.current_plan);
    data.append("verified", String(formData.verified));
    if (formData.image) {
      data.append("image", formData.image);
    }
    onConfirm(data);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLoading ? undefined : onClose}
            className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 pb-4 border-b border-gray-50">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  {title}
                </h3>
                <p className="text-sm text-slate-500 font-medium tracking-tight">
                  {user
                    ? `Editing details for ${user.name || "user"}`
                    : "Please fill in the user information below."}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="p-2.5 bg-slate-50 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group border border-transparent hover:border-red-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-8 overflow-y-auto scrollbar-hide space-y-6 bg-white"
            >
              {/* Image Section */}
              <div className="flex flex-col items-center justify-center -mt-2">
                <div
                  className={cn(
                    "relative group cursor-pointer",
                    (isLoading || isSubscriptionOnly) && "opacity-50 pointer-events-none",
                  )}
                  onClick={() => !(isLoading || isSubscriptionOnly) && fileInputRef.current?.click()}
                >
                  <div className="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-white shadow-xl bg-slate-50 flex items-center justify-center relative transition-all duration-500 group-hover:rounded-[24px] group-hover:scale-105 border-slate-100/50">
                    {formData.imagePreview ? (
                      <Image
                        src={formData.imagePreview}
                        alt="Preview"
                        fill
                        sizes="(max-width: 96px) 100vw, 96px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                        <User
                          size={36}
                          className="text-primary/20"
                          strokeWidth={1.5}
                        />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <Camera className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Camera size={14} className="text-slate-600" />
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5 ml-0.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                      size={18}
                    />
                    <input
                      type="text"
                      name="name"
                      required
                      disabled={isLoading || isSubscriptionOnly}
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Alice Johnson"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-[18px] text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none font-semibold placeholder:text-slate-300 text-slate-900 disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5 ml-0.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                      size={18}
                    />
                    <input
                      type="email"
                      name="email"
                      required
                      disabled={isLoading || !!user}
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="alice@example.com"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-[18px] text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none font-semibold placeholder:text-slate-300 text-slate-900 disabled:opacity-60"
                    />
                  </div>
                </div>


                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5 ml-0.5">
                    {user ? "New Password" : "Password"}{" "}
                    <span
                      className={cn(
                        "text-red-500",
                        user &&
                          "text-slate-400 text-[10px] font-normal uppercase tracking-wider",
                      )}
                    >
                      {user ? "(optional)" : "*"}
                    </span>
                  </label>
                  <div className="relative group">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                      size={18}
                    />
                    <input
                      type="password"
                      name="password"
                      required={!user}
                      disabled={isLoading || !!user}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={user ? "••••••••" : "Create password"}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-[18px] text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none font-semibold placeholder:text-slate-300 text-slate-900 disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>

              {/* Subscription Type */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-0.5">
                  <Crown size={16} className="text-slate-400" /> Subscription
                  Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      id: "monthly",
                      label: "Basic",
                      desc: "Limited access",
                      icon: CheckCircle2,
                    },
                    {
                      id: "yearly",
                      label: "Premium",
                      desc: "Full access",
                      icon: Crown,
                    },
                  ].map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() =>
                        !isLoading &&
                        setFormData((prev) => ({
                          ...prev,
                          current_plan: plan.id,
                        }))
                      }
                      className={cn(
                        "flex items-center justify-between p-4 rounded-[20px] border-2 transition-all text-left group relative overflow-hidden",
                        formData.current_plan === plan.id
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/5"
                          : "border-slate-100 bg-white hover:border-slate-200",
                      )}
                    >
                      <div className="space-y-0.5 relative z-10">
                        <span
                          className={cn(
                            "block font-bold text-sm transition-colors",
                            formData.current_plan === plan.id
                              ? "text-primary"
                              : "text-slate-700",
                          )}
                        >
                          {plan.label}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                          {plan.desc}
                        </span>
                      </div>
                      <plan.icon
                        size={20}
                        className={cn(
                          "transition-all relative z-10",
                          formData.current_plan === plan.id
                            ? "text-primary scale-110"
                            : "text-slate-300",
                        )}
                      />
                      {formData.current_plan === plan.id && (
                        <motion.div
                          layoutId="activePlan"
                          className="absolute inset-0 bg-primary/5"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Account Status Toggle Wrapper */}
              <div className="space-y-3 p-6 rounded-[24px] bg-slate-50/50 border border-slate-100 flex items-center justify-between group">
                <div className="flex gap-4 items-center">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                      formData.verified
                        ? "bg-green-100 text-green-600 rotate-12"
                        : "bg-slate-200 text-slate-400 rotate-0",
                    )}
                  >
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {formData.verified ? "Account Verified" : "Not Verified"}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">
                      {formData.verified
                        ? "User account is verified and active"
                        : "User account is pending verification"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isLoading || isSubscriptionOnly}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      verified: !prev.verified,
                    }))
                  }
                  className={cn(
                    "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none",
                    formData.verified ? "bg-primary" : "bg-slate-300",
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-xl transition-transform duration-300",
                      formData.verified ? "translate-x-5" : "translate-x-0",
                    )}
                  />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all cursor-pointer text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 cursor-pointer active:scale-95 text-sm disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : user ? (
                    "Update User"
                  ) : (
                    "Create User"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
