/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Shield, Mail, Tag, User as UserIcon, Clock, BadgeCheck } from "lucide-react";
import Image from "next/image";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, any> | null;
}

export default function DetailsModal({
  isOpen,
  onClose,
  data,
}: DetailsModalProps) {
  if (!data) return null;

  const subscriptionFields = ["Subscription Status", "Plan", "Start Date", "Expiry Date"];
  
  const getIcon = (key: string) => {
    const k = key.toLowerCase();
    if (k.includes("name")) return <UserIcon size={16} />;
    if (k.includes("email")) return <Mail size={16} />;
    if (k.includes("status")) return <Shield size={16} />;
    if (k.includes("plan")) return <Tag size={16} />;
    if (k.includes("date")) return <Calendar size={16} />;
    return <Clock size={16} />;
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
            className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Custom Header */}
            <div className="relative h-24 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent shrink-0">
               <button
                onClick={onClose}
                className="absolute right-4 top-4 p-2 bg-white/80 hover:bg-red-50 rounded-full text-secondary hover:text-red-500 transition-all cursor-pointer z-10 shadow-sm"
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile Section */}
            <div className="relative px-8 pb-4 shrink-0 -mt-12">
               <div className="flex items-end gap-6">
                  <div className="w-28 h-28 rounded-3xl bg-white p-1 shadow-xl border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 relative">
                    {data?.avatar ? (
                      <div className="relative w-full h-full rounded-[20px] overflow-hidden">
                        <Image
                          src={data.avatar}
                          alt={data.Name || "User"}
                          fill
                          sizes="(max-width: 112px) 100vw, 112px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full rounded-[20px] bg-primary/5 flex items-center justify-center">
                         <UserIcon size={40} className="text-primary/20" />
                      </div>
                    )}
                  </div>
                  <div className="pb-2 space-y-1">
                     <h3 className="text-2xl font-bold text-slate-900 leading-none flex items-center gap-2">
                        {data.Name || "Unnamed User"}
                        {data["Account Status"] === "verified" && (
                           <BadgeCheck size={20} className="text-blue-500 fill-blue-50" />
                        )}
                     </h3>
                     <p className="text-slate-500 font-medium flex items-center gap-1.5 text-sm">
                        <Mail size={14} className="text-slate-400" />
                        {data.Email}
                     </p>
                  </div>
               </div>
            </div>

            <div className="p-8 pt-4 overflow-y-auto scrollbar-hide space-y-8">
              {/* General Info */}
              <div className="grid grid-cols-2 gap-4">
                 {Object.entries(data).map(([key, value]) => {
                    if (subscriptionFields.includes(key) || key === "Name" || key === "Email" || key === "avatar" || key === "id") return null;
                    
                    return (
                       <div key={key} className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50 space-y-1.5">
                          <div className="flex items-center gap-2 text-slate-400">
                             {getIcon(key)}
                             <span className="text-[10px] font-bold uppercase tracking-wider">{key}</span>
                          </div>
                          <div className="font-bold text-slate-700 truncate capitalize">{String(value)}</div>
                       </div>
                    )
                 })}
              </div>

              {/* Subscription Details Box */}
              <div className="rounded-3xl border border-primary/10 bg-primary/[0.02] p-6 space-y-6">
                 <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-primary flex items-center gap-2 uppercase tracking-tight">
                       <Tag size={16} /> Subscription Details
                    </h4>
                    <span className={cn(
                       "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                       data["Subscription Status"] === "monthly" || data["Subscription Status"] === "yearly" 
                       ? "bg-primary text-white shadow-lg shadow-primary/20" 
                       : "bg-slate-200 text-slate-500"
                    )}>
                       {data["Subscription Status"]}
                    </span>
                 </div>

                 <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-1">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Plan</span>
                       <span className="text-lg font-bold text-slate-900 capitalize">{data.Plan || "Free"}</span>
                    </div>
                    <div className="space-y-1">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Joined Since</span>
                       <span className="text-lg font-bold text-slate-900">{data["Joined Date"]}</span>
                    </div>
                    <div className="space-y-1">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Start Date</span>
                       <span className="text-lg font-bold text-slate-900 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          {data["Start Date"] || "—"}
                       </span>
                    </div>
                    <div className="space-y-1">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Expiry Date</span>
                       <span className="text-lg font-bold text-slate-900 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                          {data["Expiry Date"] || "—"}
                       </span>
                    </div>
                 </div>
              </div>
            </div>

            <div className="flex p-6 shrink-0 bg-white border-t border-slate-50 gap-3">
              <button
                onClick={onClose}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 cursor-pointer active:scale-[0.98] text-sm"
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
