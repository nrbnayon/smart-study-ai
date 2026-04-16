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
    default: "BASSPORT Pro | #1 Bass Fishing Intelligence & Lake Reports",
    template: "%s | BASSPORT Pro",
  },
  description:
    "Join the ultimate bass fishing community. Access real-time lake intelligence, expert fishing reports, seasonal patterns, and share your trophy catches on BASSPORT Pro.",
  keywords: [
    "bass fishing",
    "bass fishing reports",
    "best bass lakes",
    "fishing intelligence",
    "trophy bass catches",
    "bass fishing community",
    "lake conditions",
    "fishing techniques",
    "BASSPORT Pro",
    "angler reports",
  ],
  icons: {
    icon: `${process.env.NEXT_PUBLIC_APP_URL}/icons/logo.png`,
    apple: `${process.env.NEXT_PUBLIC_APP_URL}/icons/logo.png`,
  },
  authors: [{ name: "BASSPORT Pro Team" }],
  creator: "BASSPORT Pro",
  publisher: "BASSPORT Pro",
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
    siteName: "BASSPORT Pro",
    title: "BASSPORT Pro | #1 Bass Fishing Intelligence & Lake Reports",
    description:
      "Master bass fishing with premium lake intelligence, catch reports, and angler insights. Your destination for trophy bass fishing.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/icons/logo.png`,
        width: 1200,
        height: 630,
        alt: "BASSPORT Pro - Bass Fishing Intelligence Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BASSPORT Pro | Bass Fishing Intelligence & Lake Reports",
    description:
      "The most comprehensive bass fishing platform for intelligence, reports, and trophy catches.",
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/icons/logo.png`],
  },
  alternates: {
    canonical: "/",
  },
  category: "Fishing & Outdoors",
  classification: "Sports Intelligence Platform",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1A365D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: process.env.NEXT_PUBLIC_APP_NAME || "BASSPORT Pro",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    description:
      "Discover top bass fishing lakes, real-time reports, and trophy catches with BASSPORT Pro.",
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
