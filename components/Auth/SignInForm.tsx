"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { useAppDispatch } from "@/redux/hooks";
import { setCredentials } from "@/redux/features/authSlice";
import { useSigninMutation } from "@/redux/services/authApi";
import { toast } from "sonner";
import { signinValidationSchema } from "@/lib/formDataValidation";

type FormValues = z.infer<typeof signinValidationSchema>;

const setClientCookie = (
  name: string,
  value: string,
  maxAgeSeconds?: number,
) => {
  if (typeof document === "undefined") return;

  const secureFlag = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const maxAgePart =
    typeof maxAgeSeconds === "number" ? `; Max-Age=${maxAgeSeconds}` : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; SameSite=Lax${secureFlag}${maxAgePart}`;
};

export const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [signin, { isLoading }] = useSigninMutation();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(signinValidationSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const handleTrimChange =
    (field: "email" | "password") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const trimmed = e.target.value.trim();
      setValue(field, trimmed, { shouldValidate: true });
    };

  const onSubmit = async (data: FormValues) => {
    const cleanData = {
      ...data,
      email: data.email.trim(),
      password: data.password.trim(),
    };

    // 🛠 Development bypass: Login with dummy credentials
    if (
      process.env.NODE_ENV === "development" &&
      cleanData.email === "admin@dev.com" &&
      cleanData.password === "admin123"
    ) {
      toast.info("Dev Mode: Bypassing authentication...");
      const dummyResponse = {
        accessToken: "dev-bypass-token",
        refreshToken: "dev-bypass-refresh-token",
        role: "admin",
        email: "admin@dev.com",
        name: "Dev Admin",
        permissions: ["admin", "read", "write"],
      };

      const maxAgeSeconds = cleanData.rememberMe ? 7 * 24 * 60 * 60 : undefined;
      setClientCookie("accessToken", dummyResponse.accessToken, maxAgeSeconds);
      setClientCookie("userRole", dummyResponse.role, maxAgeSeconds);
      setClientCookie("userEmail", dummyResponse.email, maxAgeSeconds);
      setClientCookie("userName", dummyResponse.name, maxAgeSeconds);
      setClientCookie(
        "userPermissions",
        JSON.stringify(dummyResponse.permissions),
        maxAgeSeconds,
      );
      setClientCookie("authSession", "1", maxAgeSeconds);

      dispatch(
        setCredentials({
          user: {
            name: dummyResponse.name,
            email: dummyResponse.email,
            role: dummyResponse.role,
            permissions: dummyResponse.permissions,
            avatar: "/images/avatar.png",
          },
          accessToken: dummyResponse.accessToken,
          refreshToken: dummyResponse.refreshToken,
        }),
      );

      toast.success("Logged in successfully (Dev Bypass)!");
      router.push("/dashboard");
      return;
    }

    try {
      const response = await signin(cleanData).unwrap();

      const maxAgeSeconds = cleanData.rememberMe ? 7 * 24 * 60 * 60 : undefined;
      setClientCookie("accessToken", response.accessToken, maxAgeSeconds);
      setClientCookie("userRole", response.role, maxAgeSeconds);
      setClientCookie("userEmail", response.email, maxAgeSeconds);
      setClientCookie("userName", response.name || "User", maxAgeSeconds);
      setClientCookie(
        "userPermissions",
        JSON.stringify(response.permissions || []),
        maxAgeSeconds,
      );

      setClientCookie("authSession", "1", maxAgeSeconds);

      const userPayload = {
        name: response.name || "User",
        email: response.email,
        role: response.role,
        permissions: response.permissions,
        image: "/images/avatar.png",
      };

      dispatch(
        setCredentials({
          user: userPayload,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        }),
      );

      toast.success("Logged in successfully!");

      if (userPayload.role === "user") {
        router.push(redirect || "/");
      } else {
        router.push("/dashboard");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Signin error:", error);
      let message = "Signin failed. Please try again.";

      if (error?.data?.message) {
        message = error.data.message;
        // Clean up technical validation strings
        if (message.includes("validation failed") || message.includes("enum value")) {
          message = "There was a problem with your account information. Please contact support.";
        }
      } else if (error?.status === 500) {
        message = "Server error. Please try again later.";
      } else if (error?.status === "FETCH_ERROR") {
        message = "Cannot connect to server. Please check your internet connection.";
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
          Login
        </h1>
        <p className="text-secondary font-onest text-lg">
          Enter your details to continue
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <div className="space-y-4">
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
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
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
                className="absolute right-5 inset-y-0 text-gray-400 hover:text-primary transition-colors z-10 p-1 flex items-center justify-center"
                aria-label={showPassword ? "Hide password" : "Show password"}
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
        </div>

        <div className="flex items-center justify-between">
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="rememberMe"
                  className="rounded-md border-gray-300 data-[state=checked]:bg-primary"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-base text-[#1F232A] cursor-pointer font-normal"
                >
                  Remember me
                </Label>
              </div>
            )}
          />
          <Link
            href="/forgot-password"
            className="text-base text-primary font-medium hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-lg font-semibold rounded-2xl shadow-lg shadow-primary/20"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Log in"}
        </Button>

        <div className="text-center pt-2">
          <span className="text-secondary font-onest text-lg">
            Don&apos;t have an account?{" "}
          </span>
          <Link
            href="/signup"
            className="text-primary font-bold font-onest text-lg hover:underline ml-1"
          >
            Sign up
          </Link>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
            <p className="text-sm font-semibold text-primary mb-2">Dev Helpers:</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full border-primary/30 text-primary hover:bg-primary/10"
              onClick={() => {
                setValue("email", "admin@dev.com", { shouldValidate: true });
                setValue("password", "admin123", { shouldValidate: true });
                handleSubmit(onSubmit)();
              }}
            >
              Quick Dev Login (admin@dev.com)
            </Button>
          </div>
        )}
      </form>
    </motion.div>
  );
};
