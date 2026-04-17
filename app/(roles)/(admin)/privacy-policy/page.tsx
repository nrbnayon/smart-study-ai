/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { Button } from "@/components/ui/button";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "@/redux/services/settingsApi";
import {
  FileText,
  ShieldCheck,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  GripVertical,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  privacyPolicy as defaultPrivacy,
  termsOfService as defaultTerms,
} from "@/data/legalData";

interface LegalSection {
  id: string;
  title: string;
  content: string;
}

export default function AdminPrivacyPolicyPage() {
  const { data, isLoading } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateSettingsMutation();

  const [activeTab, setActiveTab] = useState<"privacy" | "terms">("privacy");
  const [sections, setSections] = useState<LegalSection[]>([]);

  // Initialize from server or defaults
  useEffect(() => {
    if (data?.data) {
      const rawContent =
        activeTab === "privacy"
          ? data.data.privacyPolicy
          : data.data.termsOfService;

      try {
        if (rawContent) {
          const parsed = JSON.parse(rawContent);
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setSections(Array.isArray(parsed) ? parsed : []);
        } else {
          setSections(activeTab === "privacy" ? defaultPrivacy : defaultTerms);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        setSections(activeTab === "privacy" ? defaultPrivacy : defaultTerms);
      }
    }
  }, [data, activeTab]);

  const handleUpdateSection = (
    index: number,
    field: keyof LegalSection,
    value: string,
  ) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    setSections(updated);
  };

  const handleAddSection = () => {
    const newId = `section-${Date.now()}`;
    setSections([
      ...sections,
      { id: newId, title: "New Section", content: "" },
    ]);
  };

  const handleRemoveSection = (index: number) => {
    if (confirm("Are you sure you want to remove this section?")) {
      setSections(sections.filter((_, i) => i !== index));
    }
  };

  const handleSaveAll = async () => {
    try {
      const payload = {
        [activeTab === "privacy" ? "privacyPolicy" : "termsOfService"]:
          JSON.stringify(sections),
      };
      await updateSettings(payload).unwrap();
      toast.success(
        `${activeTab === "privacy" ? "Privacy" : "Terms"} published successfully!`,
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      toast.error("Failed to publish changes.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 animate-pulse">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
        <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">
          Loading Intelligence...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-12">
      <DashboardHeader
        title="Policy Manager"
        description="Craft and refine platform rules with a compact, section-based editor."
      />

      <div className="px-6 w-full mx-auto flex flex-col gap-6 mt-5">
        {/* Compact Tabs & Save */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm w-fit">
            <TabItem
              active={activeTab === "privacy"}
              onClick={() => setActiveTab("privacy")}
              icon={ShieldCheck}
              label="Privacy"
            />
            <TabItem
              active={activeTab === "terms"}
              onClick={() => setActiveTab("terms")}
              icon={FileText}
              label="Terms"
            />
          </div>

          <Button
            onClick={handleSaveAll}
            disabled={isUpdating}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-6 shadow-md flex items-center gap-2 font-bold text-sm transition-all shadow-indigo-100 cursor-pointer"
          >
            {isUpdating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Publish Changes
          </Button>
        </div>

        {/* Compact Sections List */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {sections.map((section, idx) => (
              <motion.div
                key={section.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:border-indigo-300 group transition-all"
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col gap-3">
                  {/* Card Header (Compact) */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-indigo-500 transition-colors">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500/60">
                        Section {idx + 1}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={handleSaveAll}
                        variant="ghost"
                        className="h-8 px-3 rounded-lg text-xs font-bold text-emerald-600 gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Save Section
                      </Button>
                      <button
                        onClick={() => handleRemoveSection(idx)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Inputs (Compact) */}
                  <div className="grid grid-cols-1 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-tight ml-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) =>
                          handleUpdateSection(idx, "title", e.target.value)
                        }
                        className="w-full h-11 bg-gray-50/50 border border-gray-200 rounded-xl px-4 text-base font-bold text-gray-900 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50/50 transition-all outline-none"
                        placeholder="Section Title..."
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-tight ml-1">
                        Content
                      </label>
                      <textarea
                        value={section.content}
                        onChange={(e) =>
                          handleUpdateSection(idx, "content", e.target.value)
                        }
                        className="w-full min-h-[80px] bg-gray-50/50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600 leading-relaxed focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50/50 transition-all outline-none resize-none"
                        placeholder="Legal content..."
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Compact Add Button */}
          <button
            onClick={handleAddSection}
            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-2 text-gray-400 hover:border-indigo-200 hover:text-indigo-500 hover:bg-indigo-50/20 transition-all group cursor-pointer mb-5"
          >
            <Plus className="w-4 h-4" />
            <span className="font-bold text-xs uppercase tracking-widest">
              New Section
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function TabItem({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer
        ${
          active
            ? "bg-gray-900 text-white shadow shadow-gray-200 scale-[1.02]"
            : "text-gray-500 hover:text-gray-900"
        }
      `}
    >
      <Icon className={`w-3.5 h-3.5 ${active ? "text-indigo-400" : ""}`} />
      {label}
    </button>
  );
}
