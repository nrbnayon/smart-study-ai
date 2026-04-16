import UserManagementClient from "@/components/AuthProtected/Admin/UserManagement/UserManagementClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management - Bass Insight Port Pro",
  description: "User Management - Bass Insight Port Pro",
};

export default function UsersPage() {
  return <UserManagementClient />;
}
