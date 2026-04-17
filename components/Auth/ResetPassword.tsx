/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useResetPasswordMutation } from "@/redux/services/authApi";
import { LeftSideImage } from "./LeftSideImage";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordContent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const otp = searchParams.get("otp") || "";

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!email || !otp) {
      toast.error("Invalid reset link. Please start over.");
      router.push("/forgot-password");
    }
  }, [email, otp, router]);

  const handleTrimChange = (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const trimmed = e.target.value.trim();
    setValue(field, trimmed, { shouldValidate: true });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const result = await resetPassword({
        email,
        otp,
        newPassword: data.newPassword
      }).unwrap();
      
      toast.success(result?.message || "Password reset successfully!");
      router.push("/reset-success"); 
    } catch (error: any) {
      console.error("Reset failed:", error);
      toast.error(error?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-background overflow-x-hidden">
      <LeftSideImage image="/icons/reset-pass.svg" />
      
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          {/* Logo & Header */}
          <div className="text-center space-y-3 mb-8">
            <Link href="/signin" className="inline-block mb-4">
               <Image src="/icons/logo.svg" alt="Logo" width={160} height={50} className="mx-auto" />
            </Link>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground font-onest">
              Reset Password
            </h1>
            <p className="text-secondary font-onest text-lg">
              Set your new password to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 auth-card shadow-lg p-5 sm:p-8">
            <div className="space-y-4">
              {/* New Password */}
              <div className="space-y-1">
                <Label htmlFor="newPassword" className="text-base font-medium text-foreground">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    placeholder="Enter new password"
                    type={showPassword ? "text" : "password"}
                    className={cn(
                      "h-12 rounded-xl border-gray-200 focus:border-primary/50 px-3 pr-12 text-base",
                      errors.newPassword && "border-destructive focus:border-destructive"
                    )}
                    {...register("newPassword")}
                    onChange={handleTrimChange("newPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 inset-y-0 text-gray-400 hover:text-primary transition-colors flex items-center justify-center p-1"
                  >
                    {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </button>
                </div>
                {errors.newPassword?.message && (
                  <p className="text-sm text-destructive font-medium px-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="text-base font-medium text-foreground">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    type={showConfirmPassword ? "text" : "password"}
                    className={cn(
                      "h-12 rounded-xl border-gray-200 focus:border-primary/50 px-3 pr-12 text-base",
                      errors.confirmPassword && "border-destructive focus:border-destructive"
                    )}
                    {...register("confirmPassword")}
                    onChange={handleTrimChange("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-4 inset-y-0 text-gray-400 hover:text-primary transition-colors flex items-center justify-center p-1"
                  >
                    {showConfirmPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword?.message && (
                  <p className="text-sm text-destructive font-medium px-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-base font-semibold rounded-xl mt-6"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

const ResetPassword = () => (
    <Suspense fallback={<div className="flex justify-center p-12 h-screen items-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>}>
        <ResetPasswordContent />
    </Suspense>
);

export default ResetPassword;

