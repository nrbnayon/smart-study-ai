import SettingsClient from "@/components/AuthProtected/Admin/Settings/SettingsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Settings | ${process.env.NEXT_PUBLIC_APP_NAME} `,
  description: `Settings for ${process.env.NEXT_PUBLIC_APP_NAME} admin.`,
};

export default function SettingsPage() {
  return <SettingsClient />;
}
