"use client";

import { Shield, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function SecurityTab() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)] overflow-hidden">
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
                type={showCurrent ? "text" : "password"}
                className="w-full pl-11 pr-12 py-3 bg-[#F8FAFC] border border-gray-100 rounded-xl text-base font-medium text-foreground focus:bg-white focus:outline-none focus:border-primary transition-all"
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
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
                type={showNew ? "text" : "password"}
                className="w-full pl-11 pr-12 py-3 bg-[#F8FAFC] border border-gray-100 rounded-xl text-base font-medium text-foreground focus:bg-white focus:outline-none focus:border-primary transition-all"
                placeholder="Min. 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
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
                type={showConfirm ? "text" : "password"}
                className="w-full pl-11 pr-12 py-3 bg-[#F8FAFC] border border-gray-100 rounded-xl text-base font-medium text-foreground focus:bg-white focus:outline-none focus:border-primary transition-all"
                placeholder="Re-enter new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button className="px-6 py-3 bg-primary hover:bg-[#4F46E5] text-white rounded-xl font-bold text-base transition-colors flex items-center gap-2 cursor-pointer shadow-sm">
              <Shield size={18} />
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
