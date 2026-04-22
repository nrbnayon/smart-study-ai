"use client";

import { useRef, useState } from "react";
import { BookOpen, User, Upload, Lightbulb, Mail } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const profileSchema = z.object({
  displayName: z
    .string()
    .min(3, "Display name must be at least 3 characters")
    .max(50, "Display name must be at most 50 characters"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileTab() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "Admin User",
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
      toast.success(
        "Logo uploaded successfully. Don't forget to save changes!",
      );
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
    toast.success("Admin information updated successfully!");
  };

  return (
    <div className="space-y-5">
      {/* Brand Identity */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-5 border-b border-gray-50 flex items-start gap-4">
          <div className="p-2.5 bg-indigo-50 text-primary rounded-xl shrink-0">
            <BookOpen size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Brand Identity
            </h3>
            <p className="text-secondary text-sm font-medium mt-1">
              Update your platform logo displayed in the sidebar
            </p>
          </div>
        </div>

        <div className="p-5 flex flex-col md:flex-row gap-6 items-start">
          {/* Logo Preview */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="w-28 h-28 bg-[#1E1B4B] rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm relative overflow-hidden">
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Platform Logo"
                  fill
                  sizes="(max-width: 112px) 100vw, 112px"
                  className="object-cover"
                />
              ) : (
                <BookOpen
                  size={40}
                  className="text-primary"
                  strokeWidth={1.5}
                />
              )}
            </div>
            <span className="text-xs font-semibold text-secondary">
              Current logo
            </span>
          </div>

          <div className="flex-1 space-y-5">
            <div>
              <h4 className="font-bold text-foreground mb-1 text-base">
                Platform Logo
              </h4>
              <p className="text-sm font-medium text-secondary">
                PNG, JPG or GIF — max 2 MB. Recommended: 256×256px
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/png, image/jpeg, image/gif"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 bg-primary hover:bg-primary text-white rounded-lg font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Upload size={16} strokeWidth={2.5} />
              Upload New Logo
            </button>
            <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-4 flex items-start gap-2.5">
              <Lightbulb
                size={16}
                className="text-yellow-500 mt-0.5 shrink-0"
              />
              <p className="text-sm font-medium text-secondary leading-relaxed">
                Tip: The logo appears in the sidebar header. If no logo is set,
                the default QQAI icon is used.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Information */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl border border-gray-100 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)] overflow-hidden"
      >
        <div className="p-5 border-b border-gray-50 flex items-start gap-4">
          <div className="p-2.5 bg-indigo-50 text-primary rounded-xl shrink-0">
            <User size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Admin Information
            </h3>
            <p className="text-secondary text-sm font-medium">
              Update your display name
            </p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <label className="text-base font-bold text-foreground block">
              Display Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                {...register("displayName")}
                type="text"
                className={`w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border rounded-xl text-base font-medium text-foreground focus:bg-white focus:outline-none transition-all ${
                  errors.displayName
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-100 focus:border-primary"
                }`}
                placeholder="Enter display name"
              />
            </div>
            {errors.displayName && (
              <p className="text-red-500 text-sm font-medium mt-1">
                {errors.displayName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-base font-bold text-foreground block">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                defaultValue="admin@qqai.com"
                disabled
                className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-gray-100 rounded-xl text-base font-medium text-foreground focus:bg-white focus:outline-none focus:border-primary transition-all cursor-not-allowed disabled:opacity-50"
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary hover:bg-primary text-white rounded-xl font-bold text-base transition-colors flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <User size={18} />
              )}
              Save Profile
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
