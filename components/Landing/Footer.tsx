"use client";

import React from "react";
import Link from "next/link";
import { Twitter, Github, Linkedin, Instagram } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="relative bg-[#0F172A] text-slate-400 py-24 overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-20">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="inline-block group transition-all duration-300">
              <Image
                src="/icons/logo.png"
                alt="SmartStudy AI"
                width={160}
                height={40}
                style={{ width: "auto", height: "40px" }}
                className="opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-base leading-relaxed max-w-sm text-slate-400/80">
              Empowering students worldwide with cutting-edge AI technology to
              make learning efficient, interactive, and personalized for every individual.
            </p>
            <div className="flex items-center gap-5">
              {[
                { Icon: Twitter, href: "#" },
                { Icon: Github, href: "#" },
                { Icon: Linkedin, href: "#" },
                { Icon: Instagram, href: "#" },
              ].map(({ Icon, href }, index) => (
                <Link
                  key={index}
                  href={href}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all duration-300 group"
                >
                  <Icon size={18} className="group-hover:scale-110 transition-transform" />
                </Link>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-8 relative inline-block">
              Product
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-indigo-500 rounded-full" />
            </h4>
            <ul className="space-y-4">
              {[
                { label: "Features", href: "#features" },
                { label: "How it Works", href: "#how-it-works" },
                { label: "Pricing", href: "#pricing" },
                { label: "AI Engine", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-8 relative inline-block">
              Company
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-indigo-500 rounded-full" />
            </h4>
            <ul className="space-y-4">
              {[
                { label: "About Us", href: "#" },
                { label: "Careers", href: "#" },
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-sm">
          <p className="text-slate-500 font-medium order-2 md:order-1">
            © {new Date().getFullYear()} SmartStudy AI. All rights reserved.
          </p>
          
          <div className="flex items-center gap-8 order-1 md:order-2">
            <Link href="#" className="text-slate-500 hover:text-white transition-colors">
              Cookies
            </Link>
            <Link href="#" className="text-slate-500 hover:text-white transition-colors">
              Security
            </Link>
            <Link href="#" className="text-slate-500 hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -mr-64 -mb-64 pointer-events-none" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -ml-64 -mt-64 pointer-events-none" />
    </footer>
  );
};

export default Footer;
