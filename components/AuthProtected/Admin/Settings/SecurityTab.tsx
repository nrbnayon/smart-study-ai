"use client";

import { Shield, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const securitySchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SecurityFormValues = z.infer<typeof securitySchema>;

export default function SecurityTab() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
  });

  const onSubmit = async (data: SecurityFormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
    toast.success("Password updated successfully!");
    reset();
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl border border-gray-100 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)] overflow-hidden"
      >
        <div className="p-6 md:p-8 border-b border-gray-50 flex items-start gap-4">
          <div className="p-2.5 bg-indigo-50 text-primary rounded-xl shrink-0">
            <Lock size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Change Password
            </h3>
            <p className="text-secondary text-sm font-medium mt-1">
              Use a strong password of at least 8 characters
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-base font-bold text-foreground block">
              Current Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                {...register("currentPassword")}
                type={showCurrent ? "text" : "password"}
                className={`w-full pl-11 pr-12 py-3 bg-[#F8FAFC] border rounded-xl text-base font-medium text-foreground focus:bg-white focus:outline-none transition-all ${
                  errors.currentPassword
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-100 focus:border-primary"
                }`}
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-500 text-sm font-medium mt-1">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-base font-bold text-foreground block">
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                {...register("newPassword")}
                type={showNew ? "text" : "password"}
                className={`w-full pl-11 pr-12 py-3 bg-[#F8FAFC] border rounded-xl text-base font-medium text-foreground focus:bg-white focus:outline-none transition-all ${
                  errors.newPassword
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-100 focus:border-primary"
                }`}
                placeholder="Min. 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm font-medium mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-base font-bold text-foreground block">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                {...register("confirmPassword")}
                type={showConfirm ? "text" : "password"}
                className={`w-full pl-11 pr-12 py-3 bg-[#F8FAFC] border rounded-xl text-base font-medium text-foreground focus:bg-white focus:outline-none transition-all ${
                  errors.confirmPassword
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-100 focus:border-primary"
                }`}
                placeholder="Re-enter new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm font-medium mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary hover:bg-primary text-white rounded-xl font-bold text-base transition-colors flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Shield size={18} />
              )}
              Update Password
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
