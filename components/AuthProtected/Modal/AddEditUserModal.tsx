/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import {
  X,
  User,
  Mail,
  Camera,
  Phone,
  Crown,
  ToggleLeft,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface AddEditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  title: string;
  user?: any;
}

export default function AddEditUserModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  user,
}: AddEditUserModalProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    password: "",
    plan: user?.plan || "Basic",
    status: user?.status || "Active",
    avatar: user?.avatar || "",
  });

  const [prevUser, setPrevUser] = useState(user);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  // Initialize form data only when modal opens or user changes
  // We do this during render to avoid the "React hook useEffect has a missing dependency"
  // or "Calling setState synchronously within an effect" warning
  if (isOpen !== prevIsOpen || user !== prevUser) {
    setPrevIsOpen(isOpen);
    setPrevUser(user);
    if (isOpen) {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        password: "",
        plan: user?.plan || "Basic",
        status: user?.status || "Active",
        avatar: user?.avatar || "",
      });
    }
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(formData);
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const hasValidAvatar =
    formData.avatar &&
    (formData.avatar.startsWith("/") ||
      formData.avatar.startsWith("http") ||
      formData.avatar.startsWith("data:"));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  {title}
                </h3>
                <p className="text-md text-secondary font-medium">
                  {user
                    ? `Editing details for ${user.name || "user"}`
                    : "Please fill in the user information below."}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 bg-gray-50 hover:bg-red-50 rounded-full text-secondary hover:text-red-500 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-8 overflow-y-auto scrollbar-hide space-y-2 bg-white"
            >
              {/* Image Section */}
              <div className="flex flex-col items-center justify-center">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-gray-50 flex items-center justify-center relative transition-transform duration-300 group-hover:scale-105">
                    {hasValidAvatar ? (
                      <Image
                        src={formData.avatar}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User
                        size={36}
                        className="text-gray-300"
                        strokeWidth={1.5}
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <Camera className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Camera size={14} className="text-gray-600" />
                  </div>
                </div>
                <div className="mt-4 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-md font-semibold text-primary/90 hover:text-primary transition-colors"
                  >
                    Upload Profile Photo
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-md font-semibold text-foreground flex items-center gap-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors"
                      size={18}
                    />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Alice Johnson"
                      className="w-full pl-11 pr-4 py-3.5 bg-[#F8FAFC] border border-gray-100 rounded-lg text-base focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium placeholder:text-gray-300 text-foreground"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="text-md font-semibold text-foreground flex items-center gap-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors"
                      size={18}
                    />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jhon@example.com"
                      className="w-full pl-11 pr-4 py-3.5 bg-[#F8FAFC] border border-gray-100 rounded-lg text-base focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium placeholder:text-gray-300 text-foreground"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-md font-semibold text-foreground flex items-center gap-1">
                    Phone Number{" "}
                    <span className="text-secondary font-normal text-sm ml-1">
                      (optional)
                    </span>
                  </label>
                  <div className="relative group">
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors"
                      size={18}
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+00000000000"
                      className="w-full pl-11 pr-4 py-3.5 bg-[#F8FAFC] border border-gray-100 rounded-lg text-base focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium placeholder:text-gray-300 text-foreground"
                    />
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label className="text-md font-semibold text-foreground flex items-center gap-1">
                    New Password{" "}
                    <span className="text-secondary font-normal text-sm ml-1">
                      (optional)
                    </span>
                  </label>
                  <div className="relative group">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors"
                      size={18}
                    />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Leave blank to keep unchanged"
                      className="w-full pl-11 pr-4 py-3.5 bg-[#F8FAFC] border border-gray-100 rounded-lg text-base focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium placeholder:text-gray-300 text-foreground"
                    />
                  </div>
                </div>

                {/* Subscription Type */}
                <div className="space-y-3 col-span-1 md:col-span-2">
                  <div className="flex items-center gap-2 text-md font-semibold text-foreground">
                    <Crown className="text-secondary" size={16} /> Subscription
                    Type <span className="text-red-500">*</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, plan: "Basic" }))
                      }
                      className={`py-3.5 rounded-lg border flex items-center justify-center gap-2 font-semibold text-base transition-all bg-white ${
                        formData.plan === "Basic"
                          ? "text-foreground border-primary shadow-sm"
                          : "border-gray-200 text-secondary hover:border-gray-300"
                      }`}
                    >
                      Basic
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, plan: "Premium" }))
                      }
                      className={`py-3.5 rounded-lg border flex items-center justify-center gap-2 font-semibold text-base transition-all ${
                        formData.plan === "Premium"
                          ? "bg-primary/5 text-primary border-primary shadow-sm"
                          : "bg-white border-gray-200 text-secondary hover:border-gray-300"
                      }`}
                    >
                      <Crown
                        size={18}
                        className={
                          formData.plan === "Premium"
                            ? "text-primary fill-primary/20"
                            : "text-secondary"
                        }
                      />{" "}
                      Premium
                    </button>
                  </div>
                </div>

                {/* Account Status */}
                <div className="space-y-3 col-span-1 md:col-span-2">
                  <div className="flex items-center gap-2 text-md font-semibold text-foreground">
                    <ToggleLeft className="text-secondary" size={18} /> Account
                    Status <span className="text-red-500">*</span>
                  </div>

                  <div
                    className="px-5 py-3 rounded-lg border border-gray-100 bg-[#F8FAFC]/50 flex items-center gap-4 cursor-pointer hover:border-gray-200 transition-colors shadow-sm"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        status:
                          prev.status === "Active" ? "Inactive" : "Active",
                      }))
                    }
                  >
                    <div
                      className={`relative inline-flex h-7 w-11 shrink-0 items-center rounded-full transition-colors ${
                        formData.status === "Active"
                          ? "bg-primary"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                          formData.status === "Active"
                            ? "translate-x-5"
                            : "translate-x-1"
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            formData.status === "Active"
                              ? "bg-green-500"
                              : "bg-secondary"
                          }`}
                        />
                        <span
                          className={`font-semibold text-base ${
                            formData.status === "Active"
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          {formData.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {formData.status === "Active"
                          ? "User can access the platform"
                          : "User is restricted from accessing the platform"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-5">
                <div></div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-8 py-3 bg-white border border-gray-200 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-all cursor-pointer text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer active:scale-95 text-base"
                  >
                    Save User
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
