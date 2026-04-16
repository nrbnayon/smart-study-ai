"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Mail01Icon,
  ViewIcon,
  ViewOffSlashIcon,
  UserIcon,
  LockPasswordIcon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  signinValidationSchema,
  signupValidationSchema,
  emailValidationSchema,
  resetPasswordValidationSchema,
} from "@/lib/formDataValidation";
import {
  useSigninMutation,
  useSignupMutation,
  useVerifyOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "@/redux/services/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setCredentials } from "@/redux/features/authSlice";
import { useRouter } from "next/navigation";
import { setAuthCookies as persistAuthCookies } from "@/lib/authCookies";

export type AuthView =
  | "login"
  | "signup"
  | "forgot-password"
  | "otp"
  | "reset-password"
  | "success";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: AuthView;
  redirectTo?: string;
}
export default function AuthModal({
  isOpen,
  onClose,
  initialView = "login",
  redirectTo,
}: AuthModalProps) {
  const [view, setView] = useState<AuthView>(initialView);
  const [emailForOTP, setEmailForOTP] = useState("");
  const [otpPurpose, setOtpPurpose] = useState<"signup" | "forgot-password">(
    "signup",
  );
  const [verifiedOtp, setVerifiedOtp] = useState("");

  // Sync view when initialView changes
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setView(initialView);
    }
  }, [isOpen, initialView]); // Sync when modal opens or initialView changes

  // Persist form data across unexpected closes
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [signupData, setSignupData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: true,
  });
  const [forgotData, setForgotData] = useState({ email: "" });

  // Full reset only on intentional X-button close
  const handleClose = () => {
    setLoginData({ email: "", password: "", rememberMe: false });
    setSignupData({
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: true,
    });
    setForgotData({ email: "" });
    onClose();
  };

  const renderView = () => {
    switch (view) {
      case "login":
        return (
          <LoginView
            setView={setView}
            onClose={handleClose}
            data={loginData}
            setData={setLoginData}
            redirectTo={redirectTo}
          />
        );
      case "signup":
        return (
          <SignupView
            setView={setView}
            setEmail={setEmailForOTP}
            setPurpose={setOtpPurpose}
            data={signupData}
            setData={setSignupData}
          />
        );
      case "forgot-password":
        return (
          <ForgotPasswordView
            setView={setView}
            setEmail={setEmailForOTP}
            setPurpose={setOtpPurpose}
            data={forgotData}
            setData={setForgotData}
          />
        );
      case "otp":
        return (
          <OTPView
            setView={setView}
            email={emailForOTP}
            purpose={otpPurpose}
            setVerifiedOtp={setVerifiedOtp}
          />
        );
      case "reset-password":
        return (
          <ResetPasswordView
            setView={setView}
            email={emailForOTP}
            otp={verifiedOtp}
          />
        );
      case "success":
        return (
          <SuccessView
            onClose={handleClose}
            setView={setView}
            type={otpPurpose === "signup" ? "signup" : "reset"}
          />
        );
      default:
        return (
          <LoginView
            setView={setView}
            onClose={handleClose}
            data={loginData}
            setData={setLoginData}
            redirectTo={redirectTo}
          />
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 cursor-default">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#111111B2]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-4xl shadow-2xl p-8 flex flex-col z-[210]"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              aria-label="Close authentication modal"
              title="Close"
              className="absolute right-6 top-6 text-gray-400 hover:text-red-600 hover:bg-red-500/10 rounded-full transition-colors z-[220] cursor-pointer p-1"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="w-6 h-6" />
            </button>

            {/* Content based on view */}
            <div className="flex flex-col items-center">
              <Image
                src="/icons/logo1.png"
                alt="BASSPORT Pro"
                width={160}
                height={56}
                className="mb-3 h-14 w-auto object-cover"
              />
              {renderView()}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ================= LOGIN VIEW ================= */
function LoginView({
  setView,
  onClose,
  data,
  setData,
  redirectTo,
}: {
  setView: (v: AuthView) => void;
  onClose: () => void;
  data: z.infer<typeof signinValidationSchema>;
  setData: React.Dispatch<
    React.SetStateAction<z.infer<typeof signinValidationSchema>>
  >;
  redirectTo?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signinValidationSchema),
    defaultValues: data,
  });

  const values = useWatch({ control });

  // Keep parent state in sync
  useEffect(() => {
    if (values) {
      setData((prev: z.infer<typeof signinValidationSchema>) => ({
        ...prev,
        ...values,
      }));
    }
  }, [values, setData]);

  const [signin, { isLoading }] = useSigninMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSubmit = async (formData: z.infer<typeof signinValidationSchema>) => {
    try {
      const result = await signin(formData).unwrap();

      dispatch(
        setCredentials({
          user: {
            name: result.name,
            email: result.email,
            role: result.role,
            avatar: result.avatar,
            permissions: result.permissions,
          },
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        }),
      );

      toast.success("Welcome back!");
      onClose();

      if (result.role === "admin") {
        router.push("/admin/dashboard");
      } else if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push("/");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2 tracking-tight">
          Welcome Back
        </h2>
        <p className="text-secondary text-sm font-medium">
          Sign in to access your fishing intelligence
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-[#4B5563] ml-1">Email</label>
          <div className="relative group">
            <HugeiconsIcon
              icon={Mail01Icon}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <input
              {...register("email")}
              type="email"
              placeholder="you@email.com"
              className="w-full rounded-2xl border border-[#F3F4F6] bg-white px-12 py-3.5 font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-300"
            />
          </div>
          {errors.email && (
            <span className="text-red-500 text-xs ml-1 font-bold">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-[#4B5563] ml-1">
            Password
          </label>
          <div className="relative group">
            <HugeiconsIcon
              icon={LockPasswordIcon}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••"
              className="w-full rounded-2xl border border-[#F3F4F6] bg-white px-12 py-3.5 font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500 cursor-pointer"
            >
              <HugeiconsIcon
                icon={showPassword ? ViewOffSlashIcon : ViewIcon}
                className="w-5 h-5"
              />
            </button>
          </div>
          {errors.password && (
            <span className="text-red-500 text-xs ml-1 font-bold">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mb-4 mt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none group">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-bold text-[#374151]">
              Remember me
            </span>
          </label>
          <button
            type="button"
            onClick={() => setView("forgot-password")}
            className="text-sm font-bold text-primary hover:underline cursor-pointer"
          >
            Forgot password?
          </button>
        </div>

        <button
          disabled={isSubmitting || isLoading}
          className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting || isLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <p className="text-center mt-6 text-secondary font-bold text-sm">
        Don&apos;t have an account??{" "}
        <button
          onClick={() => setView("signup")}
          className="text-primary hover:underline cursor-pointer"
        >
          Sign up free
        </button>
      </p>
    </div>
  );
}

/* ================= SIGNUP VIEW ================= */
function SignupView({
  setView,
  setEmail,
  setPurpose,
  data,
  setData,
}: {
  setView: (v: AuthView) => void;
  setEmail: (e: string) => void;
  setPurpose: (p: "signup") => void;
  data: z.infer<typeof signupValidationSchema>;
  setData: React.Dispatch<
    React.SetStateAction<z.infer<typeof signupValidationSchema>>
  >;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupValidationSchema),
    defaultValues: data,
  });

  const values = useWatch({ control });

  // Keep parent state in sync
  useEffect(() => {
    if (values) {
      setData((prev: z.infer<typeof signupValidationSchema>) => ({
        ...prev,
        ...values,
      }));
    }
  }, [values, setData]);

  const [signup, { isLoading }] = useSignupMutation();

  const onSubmit = async (formData: z.infer<typeof signupValidationSchema>) => {
    try {
      const result = await signup({
        name: formData.full_name,
        email: formData.email,
        password: formData.password,
      }).unwrap();
      setEmail(formData.email);
      setPurpose("signup");
      setView("otp");
      toast.success(
        result?.message ||
          "Verification code sent to your email, please check your email inbox or spam folder.",
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Sign up failed. Please try again.");
    }
  };

  return (
    <div className="w-full overflow-y-auto max-h-[80vh] custom-scrollbar px-2">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2 tracking-tight">
          Join BASSPORT
        </h2>
        <p className="text-secondary text-sm font-medium">
          Create your free account to start fishing smarter
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-[#4B5563] ml-1">
            Full Name
          </label>
          <div className="relative group">
            <HugeiconsIcon
              icon={UserIcon}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <input
              {...register("full_name")}
              type="text"
              placeholder="Your name"
              className="w-full rounded-2xl border border-[#F3F4F6] bg-white px-12 py-3.5 font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-300"
            />
          </div>
          {errors.full_name && (
            <span className="text-red-500 text-xs ml-1 font-bold">
              {errors.full_name.message}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-[#4B5563] ml-1">Email</label>
          <div className="relative group">
            <HugeiconsIcon
              icon={Mail01Icon}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <input
              {...register("email")}
              type="email"
              placeholder="you@email.com"
              className="w-full rounded-2xl border border-[#F3F4F6] bg-white px-12 py-3.5 font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-300"
            />
          </div>
          {errors.email && (
            <span className="text-red-500 text-xs ml-1 font-bold">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-[#4B5563] ml-1">
            Password
          </label>
          <div className="relative group">
            <HugeiconsIcon
              icon={LockPasswordIcon}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••"
              className="w-full rounded-2xl border border-[#F3F4F6] bg-white px-12 py-3.5 font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500 cursor-pointer"
            >
              <HugeiconsIcon
                icon={showPassword ? ViewOffSlashIcon : ViewIcon}
                className="w-5 h-5"
              />
            </button>
          </div>
          {errors.password && (
            <span className="text-red-500 text-xs ml-1 font-bold leading-tight">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-[#4B5563] ml-1">
            Confirm Password
          </label>
          <div className="relative group">
            <HugeiconsIcon
              icon={LockPasswordIcon}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <input
              {...register("confirmPassword")}
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your password"
              className="w-full rounded-2xl border border-[#F3F4F6] bg-white px-12 py-3.5 font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-300"
            />
          </div>
          {errors.confirmPassword && (
            <span className="text-red-500 text-xs ml-1 font-bold">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <button
          disabled={isSubmitting || isLoading}
          className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 mt-4 cursor-pointer"
        >
          {isSubmitting || isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <p className="text-center mt-6 text-secondary font-bold text-sm">
        Already have an account?{" "}
        <button
          onClick={() => setView("login")}
          className="text-primary hover:underline cursor-pointer"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}

/* ================= FORGOT PASSWORD VIEW ================= */
function ForgotPasswordView({
  setView,
  setEmail,
  setPurpose,
  data,
  setData,
}: {
  setView: (v: AuthView) => void;
  setEmail: (e: string) => void;
  setPurpose: (p: "forgot-password") => void;
  data: z.infer<typeof emailValidationSchema>;
  setData: React.Dispatch<
    React.SetStateAction<z.infer<typeof emailValidationSchema>>
  >;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(emailValidationSchema),
    defaultValues: data,
  });

  const values = useWatch({ control });

  // Keep parent state in sync
  useEffect(() => {
    if (values) {
      setData((prev: z.infer<typeof emailValidationSchema>) => ({
        ...prev,
        ...values,
      }));
    }
  }, [values, setData]);

  const [forgotPasswordUrl, { isLoading }] = useForgotPasswordMutation();

  const onSubmit = async (formData: z.infer<typeof emailValidationSchema>) => {
    try {
      const result = await forgotPasswordUrl(formData).unwrap();
      setEmail(formData.email);
      setPurpose("forgot-password");
      setView("otp");
      toast.success(result?.message || "Verification code sent to your email");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to process request");
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-2 tracking-tight">
          Forgot Password
        </h2>
        <p className="text-secondary text-sm font-medium">
          Enter your email to change your password
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-[#4B5563] ml-1">Email</label>
          <div className="relative group">
            <HugeiconsIcon
              icon={Mail01Icon}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <input
              {...register("email")}
              type="email"
              placeholder="you@email.com"
              className="w-full rounded-2xl border border-[#F3F4F6] bg-white px-12 py-3.5 font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-300"
            />
          </div>
          {errors.email && (
            <span className="text-red-500 text-xs ml-1 font-bold">
              {errors.email.message}
            </span>
          )}
        </div>

        <button
          disabled={isSubmitting || isLoading}
          className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting || isLoading ? "Processing..." : "Reset Password"}
        </button>
      </form>

      <button
        onClick={() => setView("login")}
        className="text-center w-full mt-6 text-secondary font-bold text-sm hover:text-foreground transition-colors cursor-pointer"
      >
        Back to Sign in
      </button>
    </div>
  );
}

/* ================= OTP VIEW ================= */
function OTPView({
  setView,
  email,
  purpose,
  setVerifiedOtp,
}: {
  setView: (v: AuthView) => void;
  email: string;
  purpose: "signup" | "forgot-password";
  setVerifiedOtp: (o: string) => void;
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(180);

  const [verifyOtpMutation, { isLoading: isVerifying }] =
    useVerifyOtpMutation();
  const [forgotPasswordUrl, { isLoading: isResending }] =
    useForgotPasswordMutation();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleContinue = async () => {
    if (otp.some((v) => v === "")) {
      toast.error("Please enter the full 6-digit code");
      return;
    }
    const joinedOtp = otp.join("");

    try {
      const result = await verifyOtpMutation({
        email,
        otp: joinedOtp,
      }).unwrap();
      toast.success(result?.message || "OTP verified successfully!");
      if (purpose === "signup") {
        setView("success");
      } else {
        setVerifiedOtp(joinedOtp);
        setView("reset-password");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    try {
      const result = await forgotPasswordUrl({ email }).unwrap();
      toast.success(result?.message || "New code sent to your email!");
      setCountdown(180);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-center mb-8">
        <p className="text-primary font-bold mb-4">{email}</p>
        <p className="text-secondary text-sm font-medium">
          Enter verification code sent to your email
        </p>
      </div>

      <div className="flex gap-4 mb-8">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            id={`otp-${idx}`}
            type="text"
            inputMode="numeric"
            aria-label={`OTP digit ${idx + 1}`}
            title={`OTP digit ${idx + 1}`}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className="w-14 h-16 border-2 border-gray-100 rounded-2xl text-center text-2xl font-bold text-foreground focus:border-primary focus:outline-none transition-all shadow-sm"
          />
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={isVerifying}
        className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 mb-4 cursor-pointer"
      >
        {isVerifying ? "Verifying..." : "Continue"}
      </button>

      <button
        onClick={handleResend}
        disabled={countdown > 0 || isResending}
        className={`w-full font-bold py-4 rounded-2xl transition-all ${
          countdown > 0
            ? "bg-gray-50 text-gray-400 cursor-not-allowed"
            : "bg-gray-50 text-gray-500 hover:bg-gray-100 cursor-pointer"
        }`}
      >
        {countdown > 0
          ? `Resend code in ${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, "0")}`
          : isResending
            ? "Sending..."
            : "Resend"}
      </button>
    </div>
  );
}

/* ================= RESET PASSWORD VIEW ================= */
function ResetPasswordView({
  setView,
  email,
  otp,
}: {
  setView: (v: AuthView) => void;
  email: string;
  otp: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordValidationSchema),
    defaultValues: { email: email, newPassword: "", confirmPassword: "" },
  });

  const [resetPasswordUrl, { isLoading }] = useResetPasswordMutation();

  const onSubmit = async (
    data: z.infer<typeof resetPasswordValidationSchema>,
  ) => {
    try {
      const result = await resetPasswordUrl({
        email,
        otp,
        newPassword: data.newPassword,
      }).unwrap();
      toast.success(result?.message || "Password updated successfully!");
      setView("success");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-2 tracking-tight">
          Create New Password
        </h2>
        <p className="text-secondary text-sm font-medium">
          Your identity has been verified. Set your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* New Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-[#4B5563] ml-1">
            New Password
          </label>
          <div className="relative group">
            <HugeiconsIcon
              icon={LockPasswordIcon}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <input
              {...register("newPassword")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••"
              className="w-full rounded-2xl border border-[#F3F4F6] bg-white px-12 py-3.5 font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500 cursor-pointer"
            >
              <HugeiconsIcon
                icon={showPassword ? ViewOffSlashIcon : ViewIcon}
                className="w-5 h-5"
              />
            </button>
          </div>
          {errors.newPassword && (
            <span className="text-red-500 text-xs ml-1 font-bold leading-tight">
              {errors.newPassword.message}
            </span>
          )}
        </div>

        {/* Confirm New Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-[#4B5563] ml-1">
            Confirm New Password
          </label>
          <div className="relative group">
            <HugeiconsIcon
              icon={LockPasswordIcon}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <input
              {...register("confirmPassword")}
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your new password"
              className="w-full rounded-2xl border border-[#F3F4F6] bg-white px-12 py-3.5 font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-300"
            />
          </div>
          {errors.confirmPassword && (
            <span className="text-red-500 text-xs ml-1 font-bold">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <button
          disabled={isSubmitting || isLoading}
          className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 mt-4 cursor-pointer"
        >
          {isSubmitting || isLoading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

/* ================= SUCCESS VIEW ================= */
function SuccessView({
  onClose,
  setView,
  type,
}: {
  onClose: () => void;
  setView: (v: AuthView) => void;
  type: "signup" | "reset";
}) {
  const isReset = type === "reset";
  return (
    <div className="w-full">
      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-bold text-primary mb-2 mt-4">
          Congratulations !
        </h2>
        <p className="text-secondary font-medium text-center max-w-[240px] leading-relaxed mb-10">
          {isReset
            ? "Your password has been reset successfully."
            : "Your account has been created successfully."}
        </p>

        <button
          onClick={() => setView("login")}
          className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all mb-4 cursor-pointer"
        >
          Proceed to Login
        </button>

        <button
          onClick={onClose}
          className="w-full bg-gray-50 text-gray-500 font-bold py-4 rounded-2xl hover:bg-gray-100 transition-all cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
