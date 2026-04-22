"use client";

import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Basic",
    price: "0",
    description: "Perfect for casual learners",
    features: [
      "5 AI Quizzes per month",
      "Basic Analytics",
      "PDF Upload (up to 10MB)",
      "Email Support",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Premium",
    price: "19",
    description: "Most popular for students",
    features: [
      "Unlimited AI Quizzes",
      "Advanced Performance Insights",
      "Priority PDF Processing",
      "Custom Study Paths",
      "Ad-free Experience",
    ],
    cta: "Go Pro Now",
    popular: true,
  },
  // {
  //   name: "Team",
  //   price: "49",
  //   description: "For study groups and schools",
  //   features: [
  //     "Everything in Pro",
  //     "Group Management",
  //     "Collaborative Quizzes",
  //     "Dedicated Account Manager",
  //     "Custom Branding",
  //   ],
  //   cta: "Contact Sales",
  //   popular: false,
  // },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold font-clash text-gray-900 mb-6"
          >
            Simple, <span className="text-indigo-600">Transparent</span> Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Choose the plan that fits your needs. No hidden fees.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 rounded-3xl border ${
                plan.popular 
                  ? "border-indigo-600 shadow-2xl scale-105 z-10 bg-indigo-50/30" 
                  : "border-gray-100 bg-white"
              } transition-all`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Star size={14} fill="white" />
                  MOST POPULAR
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-500 text-sm mb-6">{plan.description}</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-black text-gray-900">${plan.price}</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                {plan.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? "bg-indigo-600 text-white" : "bg-indigo-100 text-indigo-600"}`}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                className={`w-full py-6 rounded-2xl font-bold text-lg transition-all ${
                  plan.popular 
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200" 
                    : "bg-white border-2 border-gray-100 hover:border-indigo-600 hover:text-indigo-600 text-gray-900"
                }`}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
