"use client";

import { useState } from "react";
import {
  FileText,
  Calendar,
  Eye,
  Save,
  Info,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Trash2,
} from "lucide-react";
import { termsOfService } from "@/data/legalData";
import { toast } from "sonner";
import { DeleteConfirmationModal } from "@/components/Shared/DeleteConfirmationModal";
import { motion, AnimatePresence } from "framer-motion";

export default function TermsAndConditionsClient() {
  const [sections, setSections] = useState(termsOfService);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);

  const calculateTotalWords = () => {
    return sections.reduce((acc, curr) => {
      const words = curr.content.trim()
        ? curr.content.trim().split(/\s+/).length
        : 0;
      return acc + words;
    }, 0);
  };

  const totalWords = calculateTotalWords();
  const readTime = Math.max(1, Math.ceil(totalWords / 200)); // approx 200 words per minute

  const handleTitleChange = (id: string, newTitle: string) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, title: newTitle } : s)),
    );
  };

  const handleContentChange = (id: string, newContent: string) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, content: newContent } : s)),
    );
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newSections = [...sections];
    if (direction === "up" && index > 0) {
      [newSections[index - 1], newSections[index]] = [
        newSections[index],
        newSections[index - 1],
      ];
      setSections(newSections);
    } else if (direction === "down" && index < newSections.length - 1) {
      [newSections[index + 1], newSections[index]] = [
        newSections[index],
        newSections[index + 1],
      ];
      setSections(newSections);
    }
  };

  const confirmDelete = () => {
    if (sectionToDelete) {
      setSections(sections.filter((s) => s.id !== sectionToDelete));
      toast.success("Section deleted successfully");
    }
    setIsDeleteModalOpen(false);
    setSectionToDelete(null);
  };

  const handleSave = () => {
    // Local simulation of saving
    toast.success("Terms & Conditions saved successfully!");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full">
      {/* Header Block */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)] p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-primary rounded-xl shrink-0">
              <FileText size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Terms & Conditions Editor
              </h3>
              <div className="text-secondary text-sm font-medium flex items-center gap-1.5 mt-1">
                <Calendar size={14} /> Last updated: February 26, 2026
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setPreviewOpen(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-foreground hover:bg-gray-50 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-sm"
            >
              <Eye size={16} /> Preview
            </button>
            <button
              onClick={handleSave}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#818CF8] hover:bg-primary text-white rounded-xl font-bold text-sm transition-all cursor-pointer shadow-sm"
            >
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>

        <div className="mt-6 bg-[#F8FAFC] border border-gray-100 rounded-xl p-4 flex items-start gap-2.5">
          <Info size={18} className="text-[#818CF8] mt-0.5 shrink-0" />
          <p className="text-sm font-medium text-secondary leading-relaxed">
            Edit the sections below and click{" "}
            <span className="font-bold text-foreground">Save Changes</span> to
            publish. Use{" "}
            <span className="font-bold text-foreground">Preview</span> to see
            how the document looks to users. Sections can be reordered using the
            arrows.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center">
          <h4 className="text-2xl font-bold text-foreground">
            {sections.length}
          </h4>
          <p className="text-sm font-semibold text-secondary mt-1">
            Total Sections
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center">
          <h4 className="text-2xl font-bold text-foreground">{totalWords}</h4>
          <p className="text-sm font-semibold text-secondary mt-1">
            Total Words
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center">
          <h4 className="text-2xl font-bold text-foreground">{readTime} min</h4>
          <p className="text-sm font-semibold text-secondary mt-1">
            Est. Read Time
          </p>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        {sections.map((section, index) => {
          const wordCount = section.content.trim()
            ? section.content.trim().split(/\s+/).length
            : 0;
          return (
            <div
              key={section.id}
              className="bg-white rounded-xl border border-gray-100 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.02)] p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 w-full max-w-lg">
                  <GripVertical
                    size={16}
                    className="text-gray-300 cursor-grab shrink-0"
                  />
                  <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-[11px]">
                      {index + 1}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) =>
                      handleTitleChange(section.id, e.target.value)
                    }
                    className="font-bold text-[15px] text-foreground focus:outline-none w-full bg-transparent placeholder:text-gray-300"
                    placeholder="Section Title"
                  />
                </div>
                <div className="flex items-center gap-1.5 shrink-0 text-gray-400">
                  <button
                    onClick={() => moveSection(index, "up")}
                    disabled={index === 0}
                    className="p-1.5 hover:bg-gray-50 hover:text-gray-600 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronUp size={16} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={() => moveSection(index, "down")}
                    disabled={index === sections.length - 1}
                    className="p-1.5 hover:bg-gray-50 hover:text-gray-600 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronDown size={16} strokeWidth={2.5} />
                  </button>
                  <div className="w-px h-5 bg-gray-100 mx-1" />
                  <button
                    onClick={() => {
                      setSectionToDelete(section.id);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <textarea
                value={section.content}
                onChange={(e) =>
                  handleContentChange(section.id, e.target.value)
                }
                className="w-full min-h-[140px] p-4 bg-[#F8FAFC] border border-gray-100 rounded-xl text-[14px] leading-relaxed text-foreground focus:bg-white focus:outline-none focus:border-primary transition-all resize-y"
                placeholder="Write the content for this section..."
              />
              <p className="text-[12px] font-medium text-secondary mt-2.5 ml-1">
                {wordCount} words
              </p>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSectionToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Section"
        description="Are you sure you want to delete this specific section from the Terms and Conditions?"
      />

      {/* Preview Modal */}
      <AnimatePresence>
        {previewOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 overflow-y-auto"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-[24px] shadow-2xl z-50 flex flex-col max-h-[85vh] overflow-hidden"
            >
              {/* Preview Header */}
              <div className="p-6 md:p-8 flex items-start justify-between border-b border-gray-50 flex-shrink-0">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Preview — Terms & Conditions
                  </h2>
                  <p className="text-sm font-medium text-secondary mt-1">
                    As displayed to users
                  </p>
                </div>
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="px-4 py-2 bg-white border border-gray-200 text-foreground hover:bg-gray-50 rounded-xl font-bold text-xs transition-all cursor-pointer"
                >
                  Close Preview
                </button>
              </div>

              {/* Preview Content */}
              <div className="p-6 md:p-8 overflow-y-auto w-full">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-foreground tracking-tight">
                    Terms and Conditions
                  </h1>
                  <p className="text-secondary font-medium mt-2">
                    Last updated: February 26, 2026
                  </p>
                </div>

                <div className="space-y-8">
                  {sections.map((section, index) => (
                    <div key={section.id}>
                      <h3 className="text-lg font-bold text-foreground mb-3">
                        {index + 1}. {section.title}
                      </h3>
                      <p className="text-[15px] leading-relaxed text-secondary whitespace-pre-wrap">
                        {section.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
