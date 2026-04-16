import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bass Fishing Intelligence Hub | Expert Reports & Lake Insights",
  description:
    "Plan your next trophy bass fishing trip with real-time lake intelligence, detailed seasonal reports, and a community of expert anglers at BASSPORT Pro.",
  keywords: [
    "bass fishing intelligence",
    "best bass lakes in America",
    "real-time fishing reports",
    "bass tournament patterns",
    "trophy bass photos",
    "angler insights",
    "lake conditions tracker",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "BASSPORT Pro | Your Ultimate Bass Fishing Intelligence Hub",
    description:
      "Access premium lake data, track fishing conditions, and learn from real-world angler reports to catch more bass.",
    images: [
      {
        url: "/icons/logo.png",
        width: 1200,
        height: 630,
        alt: "BASSPORT Pro Landing Page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BASSPORT Pro | Master Your Bass Fishing Game",
    description: "Intelligence and reports designed to help you catch your next personal best bass.",
    images: ["/icons/logo.png"],
  },
};

export default async function HomePage() {
  // Get user role from cookies
  const cookieStore = await cookies();
  const userRole = cookieStore.get("userRole")?.value;
  const accessToken = cookieStore.get("accessToken")?.value;

  // If user is authenticated, redirect to their dashboard
  if (accessToken && userRole) {
    switch (userRole) {
      case "admin":
        redirect("/dashboard");
      default:
        redirect("/signin");
    }
  }

  // If not authenticated, redirect to public landing page
  redirect("/signin");
}
