"use client";

import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import Pricing from "./Pricing";
import Footer from "./Footer";
import { motion, useScroll, useSpring } from "framer-motion";
import Image from "next/image";

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 z-[60] origin-left"
        style={{ scaleX }}
      />

      <Navbar />

      <main>
        <Hero />
        <Features />
        <HowItWorks />

        {/* Testimonial / Social Proof Section */}
        <section className="py-20 bg-indigo-600 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-white rounded-full opacity-50" />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold font-clash text-white mb-8 leading-tight">
                &quot;SmartStudy AI changed the way I prepare for exams. I went
                from a B to an A in just one month!&quot;
              </h2>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-2 border-white/50 mb-4 overflow-hidden bg-white/20 relative">
                  <Image
                    src="https://i.pravatar.cc/150?img=32"
                    alt="Student"
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <p className="text-white font-bold text-lg">Sarah Jenkins</p>
                <p className="text-indigo-200">
                  Medical Student, Stanford University
                </p>
              </div>
            </div>
          </div>
        </section>

        <Pricing />

        {/* Final CTA */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="bg-[#0f172a] rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 blur-[100px] translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-bold font-clash text-white mb-8">
                  Ready to boost your learning?
                </h2>
                <p className="text-xl text-gray-400 mb-12">
                  Join thousands of students who are already using AI to master
                  their subjects. Start your journey today for free.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-full font-bold text-xl transition-all shadow-xl shadow-indigo-500/20 w-full sm:w-auto">
                    Get Started Free
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-10 py-5 rounded-full font-bold text-xl transition-all w-full sm:w-auto">
                    Talk to Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
