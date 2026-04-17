"use client";

import { useState } from "react";
import { Plus, Edit3, Trash2, ChevronDown } from "lucide-react";
import AddFAQModal from "@/components/AuthProtected/Modal/AddFAQModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddFaq = (newFaq: { question: string; answer: string }) => {
    setFaqs([...faqs, { ...newFaq, id: `q${faqs.length + 1}` }]);
  };

  const handleDelete = (id: string) => {
    setFaqs(faqs.filter((faq) => faq.id !== id));
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
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2.5 bg-primary hover:bg-[#4F46E5] text-white rounded-xl font-bold text-base transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Plus size={18} strokeWidth={2.5} />
          Add FAQ
        </button>
      </div>

      {/* FAQs List */}
      <div className="space-y-4 pt-2">
        {faqs.map((faq, index) => (
          <div
            key={faq.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4 hover:border-gray-200 transition-colors"
          >
            <div className="flex items-center gap-4">
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
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer rounded-lg hover:bg-gray-50">
                <Edit3 size={18} />
              </button>
              <button
                onClick={() => handleDelete(faq.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer rounded-lg hover:bg-red-50"
              >
                <Trash2 size={18} />
              </button>
              <div className="w-px h-6 bg-gray-100 mx-1" />
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer rounded-lg hover:bg-gray-50">
                <ChevronDown size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AddFAQModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddFaq}
      />
    </div>
  );
}
