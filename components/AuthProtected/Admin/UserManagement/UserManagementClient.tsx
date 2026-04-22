/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { DynamicTable } from "@/components/Shared/DynamicTable";
import { cn, resolveMediaUrl } from "@/lib/utils";
import {
  Eye,
  PencilLine,
  Trash2,
  Plus,
  Search,
  Filter,
  Users,
  Crown,
} from "lucide-react";
import { TableColumn } from "@/types/table.types";
import Image from "next/image";
import DetailsModal from "@/components/AuthProtected/Modal/DetailsModal";
import AddEditUserModal from "@/components/AuthProtected/Modal/AddEditUserModal";
import { DeleteConfirmationModal } from "@/components/Shared/DeleteConfirmationModal";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useCreateUserMutation,
  useUpdateUserByIdMutation,
} from "@/redux/services/userApi";
import { TableSkeleton } from "@/components/Skeleton/TableSkeleton";
import { toast } from "sonner";
import { User } from "@/types/users";

export default function UserManagementClient() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Map pill to API status
  const filterPills = ["All", "Premium", "Basic", "Active", "Inactive"];

  const getQueryParams = () => {
    const params: any = { page: currentPage };
    if (search) params.search = search;
    if (activeFilter === "Premium") params.subscription_status = "yearly";
    if (activeFilter === "Basic") params.subscription_status = "monthly";
    if (activeFilter === "Active") params.account_status = "verified";
    if (activeFilter === "Inactive") params.account_status = "not_verified";
    return params;
  };

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetAllUsersQuery(getQueryParams());
  const [deleteUser] = useDeleteUserMutation();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserByIdMutation();

  const users = response?.results || [];
  const totalCount = response?.count || 0;

  const columns: TableColumn<User>[] = [
    {
      key: "id",
      header: "#",
      className: "text-secondary font-medium",
      render: (id) => (
        <span className="text-xs truncate w-16 inline-block">{id}</span>
      ),
    },
    {
      key: "name",
      header: "NAME",
      render: (name: string, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/5 flex items-center justify-center overflow-hidden shrink-0">
            {row.image ? (
              <Image
                src={resolveMediaUrl(row.image)}
                alt={name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-primary font-bold text-sm uppercase">
                {name?.substring(0, 2) || "U"}
              </span>
            )}
          </div>
          <span className="font-semibold text-foreground">
            {name || "Unnamed"}
          </span>
        </div>
      ),
    },
    {
      key: "email",
      header: "EMAIL",
      className: "text-secondary",
    },
    {
      key: "subscription_status",
      header: "PLAN",
      render: (status: string) => (
        <div
          className={cn(
            "px-3 py-1 rounded-lg text-xs font-medium inline-flex items-center gap-1 capitalize",
            status === "monthly" || status === "yearly"
              ? "bg-primary/10 text-primary"
              : "bg-gray-100 text-gray-600",
          )}
        >
          {(status === "monthly" || status === "yearly") && (
            <span className="text-xs">
              <Crown size={12} />
            </span>
          )}
          {status}
        </div>
      ),
    },
    {
      key: "account_status",
      header: "STATUS",
      render: (status: string) => {
        const isActive = status === "verified";
        return (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                isActive ? "bg-[#10B981]" : "bg-gray-300",
              )}
            />
            <span
              className={cn(
                "text-sm font-medium capitalize",
                isActive ? "text-[#10B981]" : "text-gray-400",
              )}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        );
      },
    },
    {
      key: "signup_date",
      header: "JOINED",
      className: "text-secondary",
      render: (date: string) =>
        new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
  ];

  const handleOpenDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setSelectedUser(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setIsAddEditModalOpen(true);
  };

  const handleOpenDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleAddEditConfirm = async (formData: FormData) => {
    try {
      if (selectedUser) {
        await updateUser({ id: selectedUser.id, formData }).unwrap();
        toast.success("User updated successfully");
      } else {
        await createUser(formData).unwrap();
        toast.success("User created successfully");
      }
      setIsAddEditModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedUser) {
      try {
        await deleteUser(selectedUser.id).unwrap();
        toast.success("User deleted successfully");
        setIsDeleteModalOpen(false);
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete user");
      }
    }
  };

  const tableActions = [
    {
      label: "View",
      icon: <Eye size={18} />,
      onClick: (row: User) => handleOpenDetails(row),
      className:
        "hover:bg-blue-50 text-primary hover:text-primary cursor-pointer",
      variant: "primary" as const,
    },
    {
      label: "Edit",
      icon: <PencilLine size={18} />,
      onClick: (row: User) => handleOpenEdit(row),
      className:
        "hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer",
    },
    {
      label: "Delete",
      icon: <Trash2 size={18} />,
      onClick: (row: User) => handleOpenDelete(row),
      className:
        "hover:bg-red-50 text-red-500 hover:text-red-600 cursor-pointer",
      variant: "danger" as const,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader title="User Management" />

      <div className="p-4 md:p-6 space-y-6">
        {/* Search and Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)] flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none text-foreground font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="p-3 bg-[#F8FAFC] text-gray-400 rounded-xl hover:bg-gray-100 transition-colors">
              <Filter size={20} />
            </button>

            <div className="flex items-center gap-2">
              {filterPills.map((pill) => (
                <button
                  key={pill}
                  onClick={() => {
                    setActiveFilter(pill);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer",
                    activeFilter === pill
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-[#F8FAFC] text-gray-500 hover:bg-gray-100",
                  )}
                >
                  {pill}
                </button>
              ))}
            </div>

            <button
              onClick={handleOpenAdd}
              className="ml-2 flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold transition-all hover:bg-primary/90 active:scale-95 shadow-lg shadow-primary/20 cursor-pointer"
            >
              <Plus size={20} strokeWidth={3} />
              Add User
            </button>
          </div>
        </div>

        {/* User Table Container */}
        <div className="bg-white rounded-2xl border border-gray-100 flex flex-col shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50">
            <div className="flex items-center gap-2 text-[#64748B]">
              <Users size={18} />
              <span className="text-sm font-semibold">
                {isLoading ? "Loading users..." : `${totalCount} users found`}
              </span>
            </div>
          </div>

          {isLoading ? (
            <TableSkeleton rowCount={10} />
          ) : (
            <DynamicTable
              data={users}
              config={{
                columns,
                showActions: true,
                actionsLabel: "ACTIONS",
                actions: tableActions,
              }}
              pagination={{
                enabled: true,
                pageSize: 10,
                total: totalCount,
                currentPage: currentPage,
              }}
              onPageChange={setCurrentPage}
              className="border-none shadow-none"
              headerClassName="!bg-[#F8FAFC] !text-secondary font-bold text-sm border-t border-b border-gray-100 uppercase tracking-wider"
              rowClassName={cn(
                "hover:bg-gray-50/50 border-b border-gray-50 last:border-0 transition-colors",
                isFetching && "opacity-50",
              )}
            />
          )}
        </div>
      </div>

      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="User Details"
        data={
          selectedUser
            ? {
                Name: selectedUser.name,
                Email: selectedUser.email,
                "Subscription Status": selectedUser.subscription_status,
                Plan: selectedUser.current_plan,
                "Account Status": selectedUser.account_status,
                "Joined Date": new Date(
                  selectedUser.signup_date,
                ).toLocaleDateString(),
                "Start Date": selectedUser.start_date,
                "Expiry Date": selectedUser.expiry_date,
                avatar: selectedUser.image
                  ? resolveMediaUrl(selectedUser.image)
                  : null,
              }
            : null
        }
      />

      <AddEditUserModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onConfirm={handleAddEditConfirm}
        title={selectedUser ? "Edit User" : "Add New User"}
        user={selectedUser}
        isLoading={isCreating || isUpdating}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        description={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
      />
    </div>
  );
}
