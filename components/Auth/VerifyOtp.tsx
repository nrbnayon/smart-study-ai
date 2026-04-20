"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { toast } from "sonner";
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "@/redux/services/authApi";
import { LeftSideImage } from "./LeftSideImage";

const otpSchema = z.object({
  otp: z.string().length(6, {
    message: "Your one-time password must be 6 digits.",
  }),
});

type FormValues = z.infer<typeof otpSchema>;

const VerifyOtpContent = () => {
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const flow = searchParams.get("flow") || "signup";
  const email = searchParams.get("email") || "";

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const isLoading = isVerifying || isResending;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    if (!email) {
      toast.error("Email not found. Please try again from the start.");
      return;
    }

    try {
      const result = await resendOtp({ email }).unwrap();
      toast.success(result?.message || `A new code has been sent to ${email}`);
      setCountdown(180);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Resend failed:", error);
      toast.error(
        error?.data?.message || "Failed to resend OTP. Please try again.",
      );
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const result = await verifyOtp({ email, otp_code: data.otp }).unwrap();
      toast.success(result?.message || "Verification successful!");

      if (flow === "reset") {
        const secretKey = result?.data?.secret_key;
        router.push(
          `/reset-password?email=${encodeURIComponent(email)}&secret_key=${encodeURIComponent(secretKey)}`,
        );
      } else {
        router.push("/signin");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Verification failed:", error);
      toast.error(error?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-background overflow-x-hidden">
      <LeftSideImage image="/icons/otp-verify.svg" />

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
              OTP Verification
            </h1>
            <p className="text-secondary font-onest text-lg">
              Enter the 6-digit code sent to <br />
              <span className="text-primary font-medium">{email}</span>
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 auth-card shadow-lg p-5 sm:p-8 flex flex-col items-center"
          >
            <div className="w-full flex justify-center">
              <Controller
                control={control}
                name="otp"
                render={({ field }) => (
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup className="gap-2 sm:gap-3">
                      {[...Array(6)].map((_, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="w-10 h-12 sm:w-12 sm:h-14 border rounded-xl border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 text-xl font-bold font-onest"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />
            </div>
            {errors.otp && (
              <p className="text-sm text-destructive font-medium">
                {errors.otp.message}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-base font-semibold rounded-xl"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Verify OTP"
              )}
            </Button>

            <div className="text-center pt-2">
              <span className="text-secondary font-onest text-sm">
                Didn&apos;t get the email?{" "}
              </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0 || isLoading}
                className="text-primary font-bold font-onest text-sm hover:underline disabled:opacity-70 disabled:no-underline ml-1"
              >
                {countdown > 0
                  ? `Resent in ${formatTime(countdown)}`
                  : "Resend OTP"}
              </button>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/forgot-password"
                className="inline-flex items-center text-sm font-medium text-secondary hover:text-primary transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Forgot Password
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

const VerifyOtp = () => (
  <Suspense
    fallback={
      <div className="flex justify-center p-12 h-screen items-center">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    }
  >
    <VerifyOtpContent />
  </Suspense>
);

export default VerifyOtp;
