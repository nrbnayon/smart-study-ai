"use client";

import { BookOpen, User, Upload, Lightbulb, Mail } from "lucide-react";

export default function ProfileTab() {
  return (
    <div className="space-y-6">
      {/* Brand Identity */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-50 flex items-start gap-4">
          <div className="p-2.5 bg-indigo-50 text-primary rounded-xl shrink-0">
            <BookOpen size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Brand Identity
            </h3>
            <p className="text-secondary text-sm font-medium mt-1">
              Update your platform logo displayed in the sidebar
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
          {/* Logo Preview */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="w-28 h-28 bg-[#1E1B4B] rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm relative overflow-hidden">
              <BookOpen size={40} className="text-primary" strokeWidth={1.5} />
            </div>
            <span className="text-xs font-semibold text-secondary">
              Current logo
            </span>
          </div>

          <div className="flex-1 space-y-5">
            <div>
              <h4 className="font-bold text-foreground mb-1 text-base">
                Platform Logo
              </h4>
              <p className="text-sm font-medium text-secondary">
                PNG, JPG or GIF — max 2 MB. Recommended: 256×256px
              </p>
            </div>
            <button className="px-5 py-2.5 bg-primary hover:bg-[#4F46E5] text-white rounded-lg font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-sm">
              <Upload size={16} strokeWidth={2.5} />
              Upload New Logo
            </button>
            <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-4 flex items-start gap-2.5">
              <Lightbulb
                size={16}
                className="text-yellow-500 mt-0.5 shrink-0"
              />
              <p className="text-sm font-medium text-secondary leading-relaxed">
                Tip: The logo appears in the sidebar header. If no logo is set,
                the default QQAI icon is used.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Information */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-50 flex items-start gap-4">
          <div className="p-2.5 bg-indigo-50 text-primary rounded-xl shrink-0">
            <User size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Admin Information
            </h3>
            <p className="text-secondary text-sm font-medium mt-1">
              Update your display name
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-base font-bold text-foreground block">
              Display Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                defaultValue="Admin User"
                className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-gray-100 rounded-xl text-base font-medium text-foreground focus:bg-white focus:outline-none focus:border-primary transition-all"
                placeholder="Enter display name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-base font-bold text-foreground block">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                defaultValue="admin@qqai.com"
                className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-gray-100 rounded-xl text-base font-medium text-foreground focus:bg-white focus:outline-none focus:border-primary transition-all cursor-not-allowed disable disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button className="px-6 py-3 bg-primary hover:bg-[#4F46E5] text-white rounded-xl font-bold text-base transition-colors flex items-center gap-2 cursor-pointer shadow-sm">
              <User size={18} />
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
