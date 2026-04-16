"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { toast } from "sonner";
import { signupValidationSchema } from "@/lib/formDataValidation";
import { useSignupMutation } from "@/redux/services/authApi";

type FormValues = z.infer<typeof signupValidationSchema>;

export const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const [signup, { isLoading }] = useSignupMutation();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(signupValidationSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const handleTrimChange =
    (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const trimmed = typeof value === "string" ? value.trim() : value;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue(field, trimmed as any, { shouldValidate: true });
    };

  const onSubmit = async (data: FormValues) => {
    try {
      const result = await signup({
        name: data.full_name,
        email: data.email,
        password: data.password,
      }).unwrap();

      toast.success(
        result?.message || "Registration successful! Please verify your email with the OTP sent.",
      );
      router.push(
        `/verify-otp?email=${encodeURIComponent(data.email)}&flow=signup`,
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Signup error:", error);
      let message = "Registration failed. Please try again.";

      if (error?.data?.message) {
        message = error.data.message;
        // Clean up technical validation strings
        if (
          message.includes("validation failed") ||
          message.includes("enum value")
        ) {
          message =
            "There was a problem with the registration data. Please check all fields.";
        }
      } else if (error?.status === 500) {
        message = "Server error during registration. Please try again later.";
      } else if (error?.status === "FETCH_ERROR") {
        message =
          "Cannot connect to server. Please check your internet connection.";
      }

      toast.error(message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-8"
    >
      {/* Title & Subtitle */}
      <div className="text-center space-y-1">
        <h1 className="text-4xl font-semibold tracking-tight text-[#1F232A]">
          Create Account
        </h1>
        <p className="text-secondary font-onest text-lg">
          Join us today! Please fill in your details
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
        <div className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label
              htmlFor="full_name"
              className="text-base font-medium text-[#1F232A]"
            >
              Full Name
            </Label>
            <Input
              id="full_name"
              placeholder="Enter your full name"
              type="text"
              className={cn(
                "h-14 rounded-2xl border-gray-200 focus:border-primary px-5 text-base",
                errors.full_name &&
                  "border-destructive focus:border-destructive",
              )}
              {...register("full_name")}
              onChange={handleTrimChange("full_name")}
            />
            {errors.full_name?.message && (
              <p className="text-sm text-destructive font-medium px-1">
                {errors.full_name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-base font-medium text-[#1F232A]"
            >
              Email
            </Label>
            <Input
              id="email"
              placeholder="example@email.com"
              type="email"
              autoComplete="email"
              className={cn(
                "h-14 rounded-2xl border-gray-200 focus:border-primary px-5 text-base",
                errors.email && "border-destructive focus:border-destructive",
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

          {/* Password */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-base font-medium text-[#1F232A]"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                placeholder="Create password"
                type={showPassword ? "text" : "password"}
                className={cn(
                  "h-14 rounded-2xl border-gray-200 focus:border-primary px-5 pr-14 text-base",
                  errors.password &&
                    "border-destructive focus:border-destructive",
                )}
                {...register("password")}
                onChange={handleTrimChange("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-5 inset-y-0 text-gray-400 hover:text-primary transition-colors flex items-center justify-center"
              >
                {showPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password?.message && (
              <p className="text-sm text-destructive font-medium px-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-base font-medium text-[#1F232A]"
            >
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                placeholder="Confirm your password"
                type={showConfirmPassword ? "text" : "password"}
                className={cn(
                  "h-14 rounded-2xl border-gray-200 focus:border-primary px-5 pr-14 text-base",
                  errors.confirmPassword &&
                    "border-destructive focus:border-destructive",
                )}
                {...register("confirmPassword")}
                onChange={handleTrimChange("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-5 inset-y-0 text-gray-400 hover:text-primary transition-colors flex items-center justify-center"
              >
                {showConfirmPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword?.message && (
              <p className="text-sm text-destructive font-medium px-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <Controller
          name="agreeToTerms"
          control={control}
          render={({ field }) => (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="rounded-md border-gray-300 data-[state=checked]:bg-primary"
                />
                <Label
                  htmlFor="agreeToTerms"
                  className="text-base text-[#1F232A] cursor-pointer font-normal"
                >
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-primary hover:underline"
                  >
                    Privacy
                  </Link>
                </Label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-destructive text-sm font-medium px-1">
                  {errors.agreeToTerms.message}
                </p>
              )}
            </div>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-lg font-semibold rounded-2xl shadow-lg shadow-primary/20"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Create Account"
          )}
        </Button>

        <div className="text-center pt-2">
          <span className="text-secondary font-onest text-lg">
            Already have an account?{" "}
          </span>
          <Link
            href="/signin"
            className="text-primary font-bold font-onest text-lg hover:underline ml-1"
          >
            Log In
          </Link>
        </div>
      </form>
    </motion.div>
  );
};
