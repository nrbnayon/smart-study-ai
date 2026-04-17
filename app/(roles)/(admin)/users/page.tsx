import { Metadata } from "next";
import UserManagementClient from "@/components/AuthProtected/Admin/UserManagement/UserManagementClient";

export const metadata: Metadata = {
  title: `User Management | ${process.env.NEXT_PUBLIC_APP_NAME} `,
  description: `User Management for ${process.env.NEXT_PUBLIC_APP_NAME} admin.`,
};

export default function UserManagementPage() {
  return <UserManagementClient />;
}
