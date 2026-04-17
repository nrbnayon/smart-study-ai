"use client";

import { useState } from "react";
import { Plus, Edit3, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import AddFAQModal, {
  FAQData,
} from "@/components/AuthProtected/Modal/AddFAQModal";
import { DeleteConfirmationModal } from "@/components/Shared/DeleteConfirmationModal";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

const initialFaqs = [
  {
    id: "q1",
    question: "What subjects are available on the platform?",
    answer:
      "We offer Mathematics, Physics, Chemistry, Biology, English, and many more up to advanced levels.",
  },
  {
    id: "q2",
    question: "How do I upgrade to a Premium subscription?",
    answer:
      "You can upgrade your subscription from the Subscriptions page in your dashboard.",
  },
  {
    id: "q3",
    question: "Can I download study materials for offline use?",
    answer:
      "Yes, our Premium plan allows you to download materials to your device.",
  },
  {
    id: "q4",
    question: "How do I reset my password?",
    answer:
      "Go to Profile Settings -> Security to reset your password, or click 'Forgot Password' on the login screen.",
  },
  {
    id: "q5",
    question: "Is the platform accessible on mobile devices?",
    answer:
      "Yes, our platform is fully responsive and supports iOS and Android devices.",
  },
];

export default function FAQManagerTab() {
  const [faqs, setFaqs] = useState(initialFaqs);

  // Modal states
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQData | null>(null);

  // Delete confirm state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<string | null>(null);

  // Accordion state
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSaveFaq = (savedData: FAQData) => {
    if (savedData.id) {
      setFaqs(
        faqs.map((faq) =>
          faq.id === savedData.id ? { ...faq, ...savedData } : faq,
        ),
      );
      toast.success("FAQ updated successfully");
    } else {
      setFaqs([...faqs, { ...savedData, id: `q${Date.now()}` }]);
      toast.success("FAQ added successfully");
    }
  };

  const confirmDelete = () => {
    if (faqToDelete) {
      setFaqs(faqs.filter((faq) => faq.id !== faqToDelete));
      toast.success("FAQ deleted successfully");
    }
    setIsDeleteModalOpen(false);
    setFaqToDelete(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {/* Header Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">FAQ Management</h3>
          <p className="text-secondary text-sm font-medium mt-1">
            {faqs.length} questions — shown to users on the platform
          </p>
        </div>
        <button
          onClick={() => {
            setEditingFAQ(null);
            setIsFAQModalOpen(true);
          }}
          className="px-6 py-2.5 bg-primary hover:bg-primary text-white rounded-xl font-bold text-base transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Plus size={18} strokeWidth={2.5} />
          Add FAQ
        </button>
      </div>

      {/* FAQs List */}
      <div className="space-y-4 pt-2">
        {faqs.map((faq, index) => {
          const isExpanded = expandedId === faq.id;

          return (
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:border-gray-200 transition-colors"
            >
              <div className="p-5 flex items-center justify-between gap-4">
                <div
                  className="flex items-center gap-4 flex-1 cursor-pointer"
                  onClick={() => toggleExpand(faq.id)}
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-sm">
                      Q{index + 1}
                    </span>
                  </div>
                  <span className="font-bold text-base text-foreground">
                    {faq.question}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingFAQ(faq);
                      setIsFAQModalOpen(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer rounded-lg hover:bg-gray-50"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFaqToDelete(faq.id);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer rounded-lg hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="w-px h-6 bg-gray-100 mx-1" />
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer rounded-lg hover:bg-gray-50"
                  >
                    {isExpanded ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 pt-1">
                      <div className="ml-14 p-4 bg-[#F8FAFC] rounded-xl text-secondary text-[15px] font-medium leading-relaxed">
                        {faq.answer}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <AddFAQModal
        isOpen={isFAQModalOpen}
        onClose={() => setIsFAQModalOpen(false)}
        onSave={handleSaveFaq}
        initialData={editingFAQ}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setFaqToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete FAQ"
        description="Are you sure you want to delete this FAQ? This action cannot be undone."
      />
    </div>
  );
}
