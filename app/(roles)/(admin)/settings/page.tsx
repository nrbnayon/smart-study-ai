"use client";

import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, updateProfile } from "@/redux/features/authSlice";
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useChangePasswordMutation,
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
} from "@/redux/services/userApi";
import Image from "next/image";
import {
  Camera,
  Eye,
  EyeOff,
  Check,
  User as UserIcon,
  Lock,
  Settings as SettingsIcon,
  ShieldCheck,
  Mail,
  Zap,
  AlertTriangle,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { resolveMediaUrl } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// ─── Types ─────────────────────────────────────────────────────────────────────
type Tab = "profile" | "password" | "system";

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const dispatch = useDispatch();
  const authUser = useSelector(selectCurrentUser);

  const { data: profileData, isLoading: profileLoading } =
    useGetMyProfileQuery();
  const { data: systemData } = useGetSystemSettingsQuery();
  const [updateMyProfile, { isLoading: updating }] =
    useUpdateMyProfileMutation();
  const [changePassword, { isLoading: changingPwd }] =
    useChangePasswordMutation();
  const [updateSystemSettings, { isLoading: updatingSystem }] =
    useUpdateSystemSettingsMutation();

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Password Visibility ──────────────────────────────────────────────────
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // ── Initialization Refs ───────────────────────────────────────────────────
  // Using refs to seed the form exactly once when data lands, to avoid cascading render lint errors.
  const profileInitialized = useRef(false);
  const settingsInitialized = useRef(false);

  // ── Profile state ──────────────────────────────────────────────────────────
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    location: "",
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // ── Password state ─────────────────────────────────────────────────────────
  const [pwForm, setPwForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [pwStrength, setPwStrength] = useState(0);

  // ── System Settings state ───────────────────────────────────
  const [systemSettings, setSystemSettings] = useState({
    autoApprove: false,
    emailNotifications: true,
    twoFactorAuth: false,
    maintenanceMode: false,
  });

  // ── Sync profile from API ──────────────────────────────────────────────────
  useEffect(() => {
    if (profileData?.data && !profileInitialized.current) {
      profileInitialized.current = true;
      const user = profileData.data;
      // Using setTimeout to avoid "cascading render" warnings by moving state update to next tick
      setTimeout(() => {
        setProfileForm({
          name: user.name || "",
          phone: user.phone || "",
          location: user.location || "",
        });
        setAvatarPreview(user.avatar || null);
      }, 0);
    }
  }, [profileData]);

  // ── Sync system settings from API ──────────────────────────────────────────
  useEffect(() => {
    if (systemData?.data && !settingsInitialized.current) {
      settingsInitialized.current = true;
      const settings = systemData.data;
      setTimeout(() => {
        setSystemSettings({
          autoApprove: !!settings.autoApproveMode,
          emailNotifications: !!settings.emailNotifications,
          twoFactorAuth: !!settings.twoFactorAuth,
          maintenanceMode: !!settings.maintenanceMode,
        });
      }, 0);
    }
  }, [systemData]);

  // ── Password strength ──────────────────────────────────────────────────────
  const calcStrength = (password: string): number => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = [
    "",
    "bg-red-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-emerald-500",
  ];

  // ── Avatar file pick ───────────────────────────────────────────────────────
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // ── Submit profile ─────────────────────────────────────────────────────────
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    if (profileForm.name.trim()) fd.append("name", profileForm.name.trim());
    if (profileForm.phone.trim()) fd.append("phone", profileForm.phone.trim());
    if (profileForm.location.trim())
      fd.append("location", profileForm.location.trim());
    if (avatarFile) fd.append("avatar", avatarFile);

    try {
      const res = await updateMyProfile(fd).unwrap();
      dispatch(
        updateProfile({
          name: res.data.name,
          avatar: res.data.avatar,
          phone: res.data.phone,
          location: res.data.location,
        }),
      );
      setAvatarFile(null);
      toast.success("Profile updated successfully!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  // ── Submit password ────────────────────────────────────────────────────────
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.new_password !== pwForm.confirm_password) {
      toast.error("Passwords don't match");
      return;
    }
    if (pwForm.new_password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      await changePassword(pwForm).unwrap();
      setPwForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      setPwStrength(0);
      toast.success("Password changed successfully!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to change password");
    }
  };

  const initials = (profileForm.name || authUser?.name || "U")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <UserIcon size={18} /> },
    { id: "password", label: "Security", icon: <Lock size={18} /> },
    { id: "system", label: "System", icon: <SettingsIcon size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-white text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* ── Page header ────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-slate-400 bg-clip-text text-transparent">
              Account Settings
            </h1>
            <p className="mt-1.5 text-sm text-secondary">
              Manage your personal information and platform configuration.
            </p>
          </div>
        </div>

        {/* ── Tab nav ──────────────────────────────────────────────────────── */}
        <div className="flex gap-1 p-1.5 rounded-xl border border-primary/20 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-secondary hover:text-primary hover:bg-primary/10"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Profile Tab ──────────────────────────────────────────────────── */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Avatar card */}
            <div className="border border-primary/20 rounded-2xl p-6 flex flex-col items-center gap-5 h-fit">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/40 transition-all duration-300 shadow-2xl">
                  {avatarPreview ? (
                    <Image
                      src={resolveMediaUrl(avatarPreview!) || "/images/avatar.png"}
                      alt="Avatar"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full scale-100 group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-orange-700 flex items-center justify-center text-3xl font-bold text-foreground">
                      {profileLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        initials
                      )}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer backdrop-blur-[2px]"
                >
                  <div className="flex flex-col items-center gap-1.5 text-white text-xs font-bold">
                    <Camera size={20} />
                    <span>CHANGE</span>
                  </div>
                </button>
                <input
                  ref={fileInputRef}
                  aria-label="file upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <div className="text-center space-y-1">
                <p className="font-bold text-foreground text-xl">
                  {profileForm.name || authUser?.name || "Anonymous User"}
                </p>
                <p className="text-sm text-slate-500 lowercase">
                  {profileData?.data?.email || authUser?.email}
                </p>
                <div className="pt-2 flex justify-center">
                  <span className="px-3 py-1 bg-slate-800/80 text-orange-400 border border-slate-700 rounded-full text-[11px] font-bold tracking-widest uppercase">
                    {profileData?.data?.role || authUser?.role || "user"}
                  </span>
                </div>
              </div>

              {avatarFile && (
                <div className="mt-2 w-full animate-pulse">
                  <p className="text-[11px] font-bold text-primary bg-primary/5 border border-primary/20 rounded-lg px-4 py-2 text-center flex items-center justify-center gap-2">
                    <Zap size={12} /> Pending Upload
                  </p>
                </div>
              )}
            </div>

            {/* Profile form */}
            <form
              onSubmit={handleProfileSubmit}
              className="lg:col-span-2 border border-primary/20 rounded-2xl p-8 space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg border border-primary/20">
                  <UserIcon className="text-primary" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Identity Details
                  </h2>
                  <p className="text-sm text-secondary">
                    Keep your personal information up to date
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Display Name</Label>
                  <Input
                    id="profile-name"
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-email">Registered Email</Label>
                  <Input
                    id="profile-email"
                    value={profileData?.data?.email || authUser?.email || ""}
                    type="email"
                    disabled
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-phone">Phone Number</Label>
                  <Input
                    id="profile-phone"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    placeholder="+1 (555) 000-0000"
                    type="tel"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-location">Base Location</Label>
                  <Input
                    id="profile-location"
                    value={profileForm.location}
                    onChange={(e) =>
                      setProfileForm((f) => ({
                        ...f,
                        location: e.target.value,
                      }))
                    }
                    placeholder="City, State"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-800/60">
                <p className="text-[11px] text-slate-500 font-medium max-w-[200px]">
                  * Security critical fields like email are managed by
                  administrators.
                </p>
                <button
                  type="submit"
                  disabled={updating || profileLoading}
                  className="group relative flex items-center gap-2 bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-xl transition duration-300 shadow-xl shadow-primary/20 text-sm overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  {updating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      UPDATING…
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      SAVE CHANGES
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Password Tab ─────────────────────────────────────────────────── */}
        {activeTab === "password" && (
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <form
                onSubmit={handlePasswordSubmit}
                className="lg:col-span-3 border border-primary/20 rounded-2xl p-8 space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
                    <ShieldCheck className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      Security Center
                    </h2>
                    <p className="text-sm text-secondary">
                      Manage your password and security keys
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showCurrentPw ? "text" : "password"}
                        value={pwForm.current_password}
                        onChange={(e) =>
                          setPwForm((f) => ({
                            ...f,
                            current_password: e.target.value,
                          }))
                        }
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary cursor-pointer"
                      >
                        {showCurrentPw ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Secret Password</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showNewPw ? "text" : "password"}
                        value={pwForm.new_password}
                        onChange={(e) => {
                          setPwForm((f) => ({
                            ...f,
                            new_password: e.target.value,
                          }));
                          setPwStrength(calcStrength(e.target.value));
                        }}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary cursor-pointer"
                      >
                        {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {/* Strength bar */}
                    {pwForm.new_password.length > 0 && (
                      <div className="px-1 space-y-1.5">
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                                i <= pwStrength
                                  ? strengthColor[pwStrength]
                                  : "bg-slate-800"
                              }`}
                            />
                          ))}
                        </div>
                        <p
                          className={`text-[10px] font-bold uppercase tracking-wider ${
                            pwStrength <= 1
                              ? "text-red-500"
                              : pwStrength === 2
                                ? "text-yellow-500"
                                : pwStrength === 3
                                  ? "text-blue-500"
                                  : "text-emerald-500"
                          }`}
                        >
                          {strengthLabel[pwStrength]} Security
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPw ? "text" : "password"}
                        value={pwForm.confirm_password}
                        onChange={(e) =>
                          setPwForm((f) => ({
                            ...f,
                            confirm_password: e.target.value,
                          }))
                        }
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPw(!showConfirmPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary cursor-pointer"
                      >
                        {showConfirmPw ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {pwForm.confirm_password && (
                    <div
                      className={`text-[10px] flex items-center gap-1.5 font-bold uppercase tracking-tighter ${
                        pwForm.new_password === pwForm.confirm_password
                          ? "text-emerald-500"
                          : "text-red-500"
                      }`}
                    >
                      {pwForm.new_password === pwForm.confirm_password ? (
                        <>
                          <Check size={12} /> Sync Matching
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={12} /> Mismatch Detected
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={changingPwd}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/80 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl transition duration-300 shadow-xl shadow-blue-500/20 text-sm cursor-pointer"
                  >
                    {changingPwd ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <ShieldCheck size={16} />
                    )}
                    {changingPwd ? "UPDATING PASSWORD…" : "SECURE ACCOUNT"}
                  </button>
                </div>
              </form>

              <div className="lg:col-span-2 space-y-4">
                <div className="border border-primary/20 rounded-xl p-6">
                  <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">
                    Security Rules
                  </h3>
                  <ul className="space-y-4">
                    {[
                      {
                        icon: <Check size={14} />,
                        text: "Minimum 8 characters",
                      },
                      {
                        icon: <Check size={14} />,
                        text: "At least one uppercase",
                      },
                      {
                        icon: <Check size={14} />,
                        text: "Contains special characters",
                      },
                      {
                        icon: <RotateCcw size={14} />,
                        text: "Invalidates all sessions",
                      },
                    ].map((rule, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-[11px] text-secondary font-medium"
                      >
                        <span className="text-blue-500 shrink-0 mt-0.5">
                          {rule.icon}
                        </span>
                        {rule.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── System Settings Tab ──────────────────────────────────────────── */}
        {activeTab === "system" && (
          <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg border border-primary/20">
                <SettingsIcon className="text-primary" size={20} />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                System Configuration
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  key: "autoApprove" as const,
                  title: "Auto-Approve",
                  desc: "Instantly verify new community accounts",
                  icon: <Zap size={18} className="text-emerald-400" />,
                  status: systemSettings.autoApprove ? "ENABLED" : "MANUAL",
                },
                {
                  key: "emailNotifications" as const,
                  title: "Email Tunnels",
                  desc: "System alerts via SMTP channels",
                  icon: <Mail size={18} className="text-blue-400" />,
                  status: systemSettings.emailNotifications ? "ACTIVE" : "OFF",
                },
                {
                  key: "twoFactorAuth" as const,
                  title: "Admin 2FA",
                  desc: "Force hardware keys for administrators",
                  icon: <Lock size={18} className="text-orange-400" />,
                  status: systemSettings.twoFactorAuth
                    ? "ENFORCED"
                    : "OPTIONAL",
                },
                {
                  key: "maintenanceMode" as const,
                  title: "Maintenance",
                  desc: "Lock public access for server tuning",
                  icon: <AlertTriangle size={18} className="text-red-500" />,
                  status: systemSettings.maintenanceMode ? "ENABLED" : "LIVE",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="border border-primary/20 p-5 rounded-2xl flex items-center justify-between group hover:border-primary/50 transition duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2.5 rounded-xl group-hover:bg-primary/20 transition duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-foreground">
                          {item.title}
                        </p>
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${
                            item.status === "ENABLED" ||
                            item.status === "ACTIVE" ||
                            item.status === "ENFORCED"
                              ? "border-primary/30 text-primary bg-primary/5"
                              : "border-foreground/30 text-foreground bg-foreground/5"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={systemSettings[item.key]}
                    onCheckedChange={(v) =>
                      setSystemSettings((s) => ({ ...s, [item.key]: v }))
                    }
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold italic">
                <ShieldCheck size={14} /> Global configurations affect all
                concurrent users.
              </div>
              <button
                type="button"
                disabled={updatingSystem}
                onClick={async () => {
                  try {
                    await updateSystemSettings({
                      autoApproveMode: systemSettings.autoApprove,
                      emailNotifications: systemSettings.emailNotifications,
                      twoFactorAuth: systemSettings.twoFactorAuth,
                      maintenanceMode: systemSettings.maintenanceMode,
                    }).unwrap();
                    toast.success("System configurations deployed!");
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  } catch (err: any) {
                    toast.error(err?.data?.message || "Deployment failed");
                  }
                }}
                className="flex items-center gap-2 bg-primary hover:bg-primary/80 disabled:opacity-50 text-white font-bold px-10 py-3.5 rounded-xl transition duration-300 shadow-2xl shadow-primary/30 text-xs tracking-widest cursor-pointer"
              >
                {updatingSystem ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
                {updatingSystem ? "DEPLOYING…" : "SAVE CHANGES"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
