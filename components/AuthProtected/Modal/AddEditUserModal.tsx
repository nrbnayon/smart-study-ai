/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

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
    name: "",
    email: "",
    plan: "Basic",
    status: "Active",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        plan: user.plan || "Basic",
        status: user.status || "Active",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        plan: "Basic",
        status: "Active",
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full text-secondary transition-colors cursor-pointer hover:text-red-500"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-secondary uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full px-4 py-3 bg-[#F8FAFC] border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-secondary uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full px-4 py-3 bg-[#F8FAFC] border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-secondary uppercase tracking-wider">
                Plan
              </label>
              <select
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none"
              >
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-secondary uppercase tracking-wider">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-50 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-500 font-semibold rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 cursor-pointer"
            >
              {user ? "Save Changes" : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
