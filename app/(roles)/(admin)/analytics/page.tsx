import AnalyticsClient from "@/components/AuthProtected/Admin/Analytics/AnalyticsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Analytics | ${process.env.NEXT_PUBLIC_APP_NAME} `,
  description: `Analytics for ${process.env.NEXT_PUBLIC_APP_NAME} admin.`,
};

export default function AnalyticsPage() {
  return <AnalyticsClient />;
}
