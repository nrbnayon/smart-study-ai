import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { RightSideImage } from "@/components/Auth/LeftSideImage";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen lg:h-screen w-full flex flex-col lg:flex-row bg-[#FCFCFD] lg:overflow-hidden">
      {/* Shared Logo for Auth Pages */}
      <Link href="/" className="lg:absolute top-8 left-8 lg:p-0 z-50 flex items-center gap-2 hover:opacity-80 transition-opacity">
        <Image
          src="/icons/logo1.png"
          alt="Logo"
          width={110}
          height={40}
          className="h-auto"
          priority
        />
      </Link>

      {/* Left Column - Form Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 relative z-10 overflow-y-auto h-full scrollbar-hidden">
        <div className="auth-card shadow-lg my-12 w-full max-w-xl p-8 sm:p-12 md:p-16">
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </div>
      </div>

      {/* Right Column - Visual Illustration */}
      <RightSideImage />
    </main>
  );
}
