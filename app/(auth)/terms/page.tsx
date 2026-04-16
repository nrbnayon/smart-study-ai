/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Scale,
  ShieldCheck,
  UserCheck,
  ScrollText,
  AlertTriangle,
  CloudOff,
  RefreshCw,
  FileText,
  LucideIcon,
  Home,
  User,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { termsOfService as defaultTerms } from "@/data/legalData";
import { useGetLegalDocsQuery } from "@/redux/services/settingsApi";
import { LegalSkeleton } from "@/components/Skeleton/LegalSkeleton";

const iconMap: Record<string, LucideIcon> = {
  acceptance: Scale,
  accounts: UserCheck,
  conduct: ShieldCheck,
  content: FileText,
  "intellectual-property": ScrollText,
  liability: AlertTriangle,
  termination: CloudOff,
  changes: RefreshCw,
};

export default function TermsOfServicePage() {
  const { data, isLoading } = useGetLegalDocsQuery();

  // Try parsing server content or fallback to static data
  let terms = defaultTerms;
  try {
    if (data?.data?.termsOfService) {
      terms = JSON.parse(data.data.termsOfService);
    }
  } catch (err) {
    console.error("Failed to parse terms from server:", err);
  }

  if (isLoading) {
    return <LegalSkeleton />;
  }
  return (
    <div className="min-h-screen bg-[#FDFDFD] py-12 px-6 sm:px-8 lg:px-12 relative">
      {/* Top Navigation */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary transition-colors bg-white px-4 py-2 rounded-full border shadow-sm"
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>
        
        <Link 
          href="/signin" 
          className="flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary transition-colors bg-white px-4 py-2 rounded-full border shadow-sm"
        >
          <User className="h-4 w-4" />
          <span>Sign In</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <Link href="/">
              <Image
                src="/icons/logo.png"
                alt="Logo"
                width={160}
                height={160}
                className="h-auto opacity-90"
                priority
              />
            </Link>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Terms of Service
          </h1>
          <div className="flex items-center justify-center gap-2 text-secondary/60 text-sm">
            <Activity className="h-4 w-4" />
            <span>Updated: {data?.data?.updatedAt ? new Date(data.data.updatedAt).toLocaleDateString() : new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block space-y-1 sticky top-12 self-start bg-white/50 p-4 rounded-2xl border border-dashed border-gray-200">
            <h3 className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] mb-4 px-2">
              On this page
            </h3>
            {terms.map((section: any, idx: number) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block px-3 py-2 text-xs font-semibold text-secondary/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
              >
                {String(idx + 1).padStart(2, '0')}. {section.title}
              </a>
            ))}
          </aside>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <div className="bg-white border border-gray-100 p-8 md:p-16 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-16">
              {terms.map((section: any) => {
                const Icon = iconMap[section.id] || FileText;
                return (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-24 group"
                  >
                    <div className="flex items-start gap-6 mb-6">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 group-hover:bg-primary group-hover:text-white transition-all duration-300" >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground tracking-tight">
                          {section.title}
                        </h2>
                        <div className="text-base text-secondary/80 leading-relaxed font-normal">
                          {section.content}
                        </div>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-12 border-t border-gray-100">
          <Button
            asChild
            variant="ghost"
            className="rounded-full gap-2 px-8 py-6 text-sm font-semibold text-secondary hover:text-primary"
          >
            <Link href="/">
              <Home className="h-4 w-4" /> Back to Home
            </Link>
          </Button>
          <Button
            asChild
            className="rounded-full gap-2 px-8 py-6 text-sm font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            <Link href="/signin">
              Get Started <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
