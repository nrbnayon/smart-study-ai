"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Target, 
  BarChart3, 
  Layout, 
  ShieldCheck, 
  Users 
} from "lucide-react";

const features = [
  {
    title: "Instant Quiz Generation",
    description:
      "Upload any PDF, document or text and our AI will generate relevant quizzes in seconds.",
    icon: Zap,
    color: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    title: "Adaptive Learning",
    description:
      "Our AI identifies your weak spots and creates personalized study paths to master them.",
    icon: Target,
    color: "bg-rose-50",
    iconColor: "text-rose-500",
  },
  {
    title: "Advanced Analytics",
    description:
      "Track your performance with detailed insights and beautiful visualizations.",
    icon: BarChart3,
    color: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  {
    title: "Smart Dashboard",
    description:
      "A clean, intuitive interface designed to keep you focused on what matters: learning.",
    icon: Layout,
    color: "bg-indigo-50",
    iconColor: "text-indigo-500",
  },
  {
    title: "Privacy Focused",
    description:
      "Your data is yours. We ensure your study materials and results are secure and private.",
    icon: ShieldCheck,
    color: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    title: "Collaborative Study",
    description:
      "Share quizzes with classmates and track progress together in real-time.",
    icon: Users,
    color: "bg-purple-50",
    iconColor: "text-purple-500",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold font-clash text-gray-900 mb-6"
          >
            Everything you need to <span className="text-indigo-600">excel</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Powerful AI tools designed to help students and professionals learn
            faster and retain more information.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group"
              >
                <div
                  className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <IconComponent size={28} className={feature.iconColor} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
