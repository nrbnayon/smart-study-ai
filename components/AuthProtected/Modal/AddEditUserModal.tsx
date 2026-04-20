/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { X, User, Mail, Camera, ToggleLeft, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn, resolveMediaUrl } from "@/lib/utils";
import { toast } from "sonner";

interface AddEditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: FormData) => void;
  title: string;
  user?: any;
  isLoading?: boolean;
}

export default function AddEditUserModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  user,
  isLoading,
}: AddEditUserModalProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    verified: user?.account_status === "verified",
    image: null as File | null,
    imagePreview: user?.image ? resolveMediaUrl(user.image) : "",
  });

  const [prevUser, setPrevUser] = useState(user);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen || user !== prevUser) {
    setPrevIsOpen(isOpen);
    setPrevUser(user);
    if (isOpen) {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        password: "",
        verified: user ? user.account_status === "verified" : true,
        image: null,
        imagePreview: user?.image ? resolveMediaUrl(user.image) : "",
      });
    }
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Password validation
    if (!user || formData.password) {
      if (formData.password.length < 8) {
        toast.error("Password must be at least 8 characters long");
        return;
      }
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    if (formData.password) data.append("password", formData.password);
    data.append("verified", String(formData.verified));
    if (formData.image) {
      data.append("image", formData.image);
    }
    onConfirm(data);
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
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLoading ? undefined : onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
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
                disabled={isLoading}
                className="p-2 bg-gray-50 hover:bg-red-50 rounded-full text-secondary hover:text-red-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-8 overflow-y-auto scrollbar-hide space-y-4 bg-white"
            >
              {/* Image Section */}
              <div className="flex flex-col items-center justify-center mb-4">
                <div
                  className={cn(
                    "relative group cursor-pointer",
                    isLoading && "opacity-50 pointer-events-none",
                  )}
                  onClick={() => !isLoading && fileInputRef.current?.click()}
                >
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-gray-50 flex items-center justify-center relative transition-transform duration-300 group-hover:scale-105">
                    {formData.imagePreview ? (
                      <Image
                        src={formData.imagePreview}
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
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="mt-4 text-md font-semibold text-primary/90 hover:text-primary transition-colors disabled:opacity-50"
                >
                  Upload Profile Photo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div className="grid grid-cols-1 gap-y-4">
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
                      disabled={isLoading}
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Alice Johnson"
                      className="w-full pl-11 pr-4 py-3.5 bg-[#F8FAFC] border border-gray-100 rounded-lg text-base focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium placeholder:text-gray-300 text-foreground disabled:opacity-60"
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
                      disabled={isLoading}
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jhon@example.com"
                      className="w-full pl-11 pr-4 py-3.5 bg-[#F8FAFC] border border-gray-100 rounded-lg text-base focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium placeholder:text-gray-300 text-foreground disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-md font-semibold text-foreground flex items-center gap-1">
                    {user ? "New Password (optional)" : "Password *"}
                  </label>
                  <div className="relative group">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors"
                      size={18}
                    />
                    <input
                      type="password"
                      name="password"
                      required={!user}
                      disabled={isLoading}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={
                        user
                          ? "Leave blank to keep unchanged"
                          : "Set user password"
                      }
                      className="w-full pl-11 pr-4 py-3.5 bg-[#F8FAFC] border border-gray-100 rounded-lg text-base focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium placeholder:text-gray-300 text-foreground disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Account Status */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-md font-semibold text-foreground">
                    <ToggleLeft className="text-secondary" size={18} /> Verified
                    Account
                  </div>

                  <div
                    className={cn(
                      "px-5 py-3 rounded-lg border border-gray-100 bg-[#F8FAFC]/50 flex items-center gap-4 cursor-pointer hover:border-gray-200 transition-colors shadow-sm",
                      isLoading && "opacity-50 pointer-events-none",
                    )}
                    onClick={() =>
                      !isLoading &&
                      setFormData((prev) => ({
                        ...prev,
                        verified: !prev.verified,
                      }))
                    }
                  >
                    <div
                      className={`relative inline-flex h-7 w-11 shrink-0 items-center rounded-full transition-colors ${
                        formData.verified ? "bg-primary" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                          formData.verified ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            formData.verified ? "bg-green-500" : "bg-secondary"
                          }`}
                        />
                        <span
                          className={`font-semibold text-base ${
                            formData.verified
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          {formData.verified ? "Verified" : "Not Verified"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {formData.verified
                          ? "User account is verified and active"
                          : "User account is pending verification"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-8 py-3 bg-white border border-gray-200 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-all cursor-pointer text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer active:scale-95 text-base disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {user ? "Updating..." : "Creating..."}
                    </>
                  ) : user ? (
                    "Update User"
                  ) : (
                    "Create User"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
