"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function ResetSuccessPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#FCFCFD]">
      {/* Logo */}
      <Link
        href="/"
        className="absolute top-8 left-8 hover:opacity-80 transition-opacity"
      >
        <Image
          src="/icons/logo.svg"
          alt="Logo"
          width={160}
          height={50}
          className="h-auto"
        />
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="auth-card w-full max-w-lg p-10 sm:p-14 text-center space-y-8"
      >
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight text-primary">
            Success!
          </h1>
          <p className="text-secondary font-onest text-lg max-w-sm mx-auto">
            Password Reset successful! You can now signin with your new
            password.
          </p>
        </div>

        <div className="pt-4">
          <Button
            asChild
            className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-lg font-semibold rounded-2xl shadow-lg shadow-primary/20"
          >
            <Link href="/signin">Log In</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
