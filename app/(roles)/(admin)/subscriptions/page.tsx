import { Metadata } from "next";
import SubscriptionsClient from "@/components/AuthProtected/Admin/Subscriptions/SubscriptionsClient";

export const metadata: Metadata = {
  title: `User Subscriptions | ${process.env.NEXT_PUBLIC_APP_NAME} `,
  description: `User Subscriptions for ${process.env.NEXT_PUBLIC_APP_NAME} admin.`,
};

export default function UserSubscriptionPage() {
  return <SubscriptionsClient />;
}
