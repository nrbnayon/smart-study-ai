import type { Metadata, Viewport } from "next";
import { Inter, Poppins, Onest, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "sonner";
import StoreProvider from "@/redux/StoreProvider";
import Script from "next/script";

const clashDisplay = localFont({
  src: [
    {
      path: "./fonts/ClashDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/ClashDisplay-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/ClashDisplay-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/ClashDisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-clash-display",
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: {
    default: "SmartStudy AI | #1 AI Quiz Generator & Learning Platform",
    template: "%s | SmartStudy AI",
  },
  description:
    "Master any subject with AI-powered quizzes. Upload PDFs, generate questions, and track your progress with SmartStudy AI.",
  keywords: [
    "AI quiz generator",
    "smart study",
    "exam prep",
    "AI learning",
    "quiz maker",
    "study assistant",
    "adaptive learning",
    "SmartStudy AI",
  ],
  icons: {
    icon: `/icons/logo.png`,
    apple: `/icons/logo.png`,
  },
  authors: [{ name: "Nayon" }],
  creator: "nrbnayon",
  publisher: "Nayon Kanti Halder",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "SmartStudy AI",
    title: "SmartStudy AI | AI-Powered Learning for Everyone",
    description:
      "Transform your notes into quizzes instantly. The most advanced AI learning platform for students and professionals.",
    images: [
      {
        url: `https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=1200`,
        width: 1200,
        height: 630,
        alt: "SmartStudy AI - AI Quiz Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartStudy AI | Master Your Studies with AI",
    description:
      "The most comprehensive AI learning platform for quiz generation and progress tracking.",
    images: [`https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=1200`],
  },
  alternates: {
    canonical: "/",
  },
  category: "Education & Technology",
  classification: "AI Learning Platform",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: process.env.NEXT_PUBLIC_APP_NAME || "SmartStudy AI",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    description:
      "Master any subject with AI-powered quizzes. The most advanced study platform.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${poppins.variable} ${onest.variable} ${geistMono.variable} ${clashDisplay.variable} antialiased bg-background font-sans`}
        suppressHydrationWarning
      >
        <Script id="strip-extension-attrs" strategy="beforeInteractive">
          {`
            (function () {
              function cleanBisAttrs() {
                var nodes = document.querySelectorAll('[bis_skin_checked]');
                for (var i = 0; i < nodes.length; i++) {
                  nodes[i].removeAttribute('bis_skin_checked');
                }
              }

              cleanBisAttrs();

              var observer = new MutationObserver(function () {
                cleanBisAttrs();
              });

              observer.observe(document.documentElement, {
                attributes: true,
                childList: true,
                subtree: true,
              });

              window.addEventListener('load', function () {
                setTimeout(function () {
                  observer.disconnect();
                }, 2000);
              });
            })();
          `}
        </Script>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          disableTransitionOnChange
          forcedTheme="light"
        >
          <StoreProvider>
            {children}
            <Toaster richColors position="top-right" />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
