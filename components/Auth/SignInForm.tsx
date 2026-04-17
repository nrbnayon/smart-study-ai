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
import {
  setCredentials,
  logout as logoutAction,
} from "@/redux/features/authSlice";
import {
  useSigninMutation,
  useLogoutMutation,
  useLazyGetCurrentUserQuery,
} from "@/redux/services/authApi";
import { toast } from "sonner";
import { signinValidationSchema } from "@/lib/formDataValidation";
import { clearAuthCookies, setAuthCookies } from "@/lib/authCookies";
import Image from "next/image";

type FormValues = z.infer<typeof signinValidationSchema>;

const extractMeProfile = (meResponse: unknown) => {
  const root =
    meResponse && typeof meResponse === "object"
      ? (meResponse as Record<string, unknown>)
      : {};
  const data =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : root;

  const permissionsRaw = data.permissions;
  const permissions = Array.isArray(permissionsRaw)
    ? permissionsRaw.filter((item): item is string => typeof item === "string")
    : [];

  return {
    name: typeof data.name === "string" ? data.name : "User",
    email: typeof data.email === "string" ? data.email : "",
    role: typeof data.role === "string" ? data.role : "",
    avatar: typeof data.avatar === "string" ? data.avatar : null,
    permissions,
  };
};

export const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [signin, { isLoading }] = useSigninMutation();
  const [logoutBackend] = useLogoutMutation();
  const [fetchCurrentUser] = useLazyGetCurrentUserQuery();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const safeRedirect =
    redirect && redirect.startsWith("/") && !redirect.startsWith("//")
      ? redirect
      : null;
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

      setAuthCookies(
        {
          accessToken: dummyResponse.accessToken,
          refreshToken: dummyResponse.refreshToken,
          userRole: dummyResponse.role,
          userEmail: dummyResponse.email,
        },
      );

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
        }),
      );

      toast.success("Logged in successfully (Dev Bypass)!");
      router.push("/dashboard");
      return;
    }

    try {
      const response = await signin(cleanData).unwrap();
      const normalizedRole = String(response.role || "").toLowerCase();

      if (normalizedRole !== "admin") {
        try {
          await logoutBackend().unwrap();
        } catch {
          // If backend logout fails, still clear client-side auth state.
        }

        clearAuthCookies();
        dispatch(logoutAction());
        toast.error("Access denied. Only admin users can log in.");
        return;
      }

      let meProfile = {
        name: response.name || "User",
        email: response.email,
        role: normalizedRole,
        avatar: response.avatar || "/images/avatar.png",
        permissions: response.permissions || [],
      };

      try {
        const meResponse = await fetchCurrentUser().unwrap();
        const extracted = extractMeProfile(meResponse);
        meProfile = {
          name: extracted.name || meProfile.name,
          email: extracted.email || meProfile.email,
          role: (extracted.role || meProfile.role).toLowerCase(),
          avatar: extracted.avatar || meProfile.avatar,
          permissions: extracted.permissions.length
            ? extracted.permissions
            : meProfile.permissions,
        };
      } catch {
        // Keep login payload fallback when /me fetch fails.
      }

      if (meProfile.role !== "admin") {
        try {
          await logoutBackend().unwrap();
        } catch {
          // Ensure cleanup even if backend logout fails.
        }

        clearAuthCookies();
        dispatch(logoutAction());
        toast.error("Access denied. Only admin users can log in.");
        return;
      }

      const userPayload = {
        name: meProfile.name,
        email: meProfile.email,
        role: meProfile.role,
        permissions: meProfile.permissions,
        avatar: meProfile.avatar,
      };

      dispatch(
        setCredentials({
          user: userPayload,
          accessToken: response.accessToken,
        }),
      );

      toast.success("Logged in successfully!");
      router.push(safeRedirect || "/dashboard");
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
      className="w-full px-4 mx-auto"
    >
      {/* Title & Subtitle */}
      <div className="text-center space-y-3 mb-3">
        <Image src="/icons/logo.svg" alt="Logo" width={160} height={50} className="mx-auto mb-2" />
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground font-onest">
         Admin Login
        </h1>
        <p className="text-secondary font-onest text-lg">
          Enter your details to continue
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 auth-card shadow-lg w-full w-full sm:min-w-lg p-5 sm:p-8">
        <div className="space-y-4">
          {/* Email */}
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
          <div className="space-y-1">
            <Label
              htmlFor="password"
              className="text-base font-medium text-foreground"
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
                  "h-12 rounded-xl border-gray-200 focus:border-primary/50 px-3 text-base",
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

        <div className="flex items-center justify-between my-6">
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
                  className="text-sm text-foreground cursor-pointer font-normal"
                >
                  Remember me
                </Label>
              </div>
            )}
          />
          <Link
            href="/forgot-password"
            className="text-sm text-primary font-medium hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-base font-semibold rounded-xl"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Log in"}
        </Button>

        <div className="text-center pt-2">
          <span className="text-secondary font-onest text-xs">
            Admin accounts are pre-configured. <br /> Contact your system administrator for access.
          </span>
          {/* <Link
            href="/signup"
            className="text-primary font-bold font-onest text-lg hover:underline ml-1"
          >
            Sign up
          </Link> */}
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
