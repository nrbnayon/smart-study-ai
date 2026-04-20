"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { emailValidationSchema } from "@/lib/formDataValidation";
import { 
  useForgotPasswordMutation,
  useResendOtpMutation 
} from "@/redux/services/authApi";
import { LeftSideImage } from "./LeftSideImage";

type FormValues = z.infer<typeof emailValidationSchema>;

const ForgetPassword = () => {
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const [forgotPassword, { isLoading: isForgotLoading }] = useForgotPasswordMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const isLoading = isForgotLoading || isResending;

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(emailValidationSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleTrimChange =
    (field: "email") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const trimmed = e.target.value.trim();
      setValue(field, trimmed, { shouldValidate: true });
    };

  const onSubmit = async (data: FormValues) => {
    try {
      const result = await forgotPassword({ email: data.email }).unwrap();
      toast.success(result?.message || "OTP sent to your email.");
      router.push(
        `/verify-otp?flow=reset&email=${encodeURIComponent(data.email)}`,
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to send OTP:", error);
      toast.error(
        error?.data?.message || "Something went wrong. Please try again.",
      );
    }
  };

  const handleResend = async () => {
    const email = getValues("email");
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }
    try {
      const result = await resendOtp({ email }).unwrap();
      toast.success(result?.message || "OTP resent to your email.");
      setCountdown(60);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Resend failed.");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-background overflow-hidden">
      <LeftSideImage image="/icons/forgot-pass.svg" />

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
              <Image
                src="/icons/logo.svg"
                alt="Logo"
                width={160}
                height={50}
                className="mx-auto"
              />
            </Link>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground font-onest">
              Forgot Password
            </h1>
            <p className="text-secondary font-onest text-lg">
              Enter your email to receive an OTP code
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 auth-card shadow-lg p-5 sm:p-8"
          >
            <div className="space-y-4">
              <div className="space-y-1">
                <Label
                  htmlFor="email"
                  className="text-base font-medium text-foreground"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="example@email.com"
                  type="email"
                  autoComplete="email"
                  className={cn(
                    "h-12 rounded-xl border-gray-200 focus:border-primary/50 px-3 text-base",
                    errors.email &&
                      "border-destructive focus:border-destructive",
                  )}
                  {...register("email")}
                  onChange={handleTrimChange("email")}
                />
                {errors.email?.message && (
                  <p className="text-sm text-destructive font-medium px-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-base font-semibold rounded-xl"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Continue"
              )}
            </Button>

            <div className="text-center pt-2">
              <span className="text-secondary font-onest text-sm">
                Didn&apos;t get the email?{" "}
              </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0}
                className="text-primary font-bold font-onest text-sm hover:underline disabled:opacity-70 disabled:no-underline ml-1"
              >
                {countdown > 0
                  ? `Resend in ${formatTime(countdown)}`
                  : "Resend OTP"}
              </button>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/signin"
                className="inline-flex items-center text-sm font-medium text-secondary hover:text-primary transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgetPassword;
