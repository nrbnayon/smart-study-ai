"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileUp, Cpu, GraduationCap, CheckCircle2 } from "lucide-react";

const steps = [
  {
    title: "Upload Materials",
    description: "Drop your PDFs, notes, or copy text directly into the platform.",
    icon: <FileUp size={32} />,
    color: "bg-indigo-600",
  },
  {
    title: "AI Analysis",
    description: "Our AI processes the content and extracts key concepts and questions.",
    icon: <Cpu size={32} />,
    color: "bg-purple-600",
  },
  {
    title: "Take Quizzes",
    description: "Practice with various quiz formats (MCQ, True/False, Short Answer).",
    icon: <GraduationCap size={32} />,
    color: "bg-blue-600",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-[#f8fafc]">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold font-clash text-gray-900 mb-6"
          >
            How it <span className="text-indigo-600">works</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Three simple steps to transform your study routine and achieve better grades.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-indigo-100 -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex flex-col items-center text-center group"
              >
                <div className={`w-20 h-20 ${step.color} text-white rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-indigo-100 group-hover:rotate-6 transition-transform`}>
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 max-w-xs mx-auto">
                  {step.description}
                </p>
                <div className="mt-6 flex items-center gap-2 text-indigo-600 font-bold">
                  <CheckCircle2 size={20} />
                  <span>Step {index + 1}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
