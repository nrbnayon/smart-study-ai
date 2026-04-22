import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import LandingPage from "@/components/Landing/LandingPage";

export const metadata: Metadata = {
  title: "SmartStudy AI | Master Any Subject with AI-Powered Quizzes",
  description:
    "Transform your study materials into interactive quizzes, track your progress with smart analytics, and learn 2x faster with SmartStudy AI.",
  keywords: [
    "AI quiz generator",
    "smart study tools",
    "AI learning platform",
    "exam preparation AI",
    "adaptive learning",
    "interactive quizzes",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "SmartStudy AI | The Future of Learning",
    description:
      "Boost your grades and master complex subjects with our advanced AI-powered study platform.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "SmartStudy AI Dashboard Mockup",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartStudy AI | Master Your Subjects Faster",
    description: "AI-powered tools designed to help you catch up and excel in your studies.",
    images: ["https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=1200"],
  },
};

export default async function HomePage() {
  // Get user role from cookies
  const cookieStore = await cookies();
  const userRole = cookieStore.get("userRole")?.value;
  const accessToken = cookieStore.get("accessToken")?.value;

  // If user is authenticated, redirect to their dashboard
  if (accessToken && userRole) {
    if (userRole === "admin") {
      redirect("/dashboard");
    }
  }

  // If not authenticated, render the public landing page
  return <LandingPage />;
}
