import { Metadata } from "next";
import DashboardOverview from "@/components/AuthProtected/Admin/Dashboard/DashboardOverview";

export const metadata: Metadata = {
  title: `Dashboard Overview | ${process.env.NEXT_PUBLIC_APP_NAME} `,
  description: `Dashboard Overview for ${process.env.NEXT_PUBLIC_APP_NAME} admin.`,
};

export default function DashboardPage() {
  return <DashboardOverview />;
}
