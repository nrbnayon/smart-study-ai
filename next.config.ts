import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add empty turbopack config to silence the warning
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.bassport.tech",
      },
      {
        protocol: "http",
        hostname: "api.bassport.tech",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
      },
      {
        protocol: "http",
        hostname: "10.10.12.11",
        port: "5000",
      },
    ],
  },
  allowedDevOrigins: ["10.10.12.11"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https: http://api.bassport.tech http://localhost:5000 http://10.10.12.11:5000 https://vercel.com https://images.unsplash.com",
              "connect-src 'self' https: http://api.bassport.tech http://localhost:5000 http://10.10.12.11:5000 ws://10.10.12.11:3000 https://vercel.live",
              "media-src 'self'",
              "object-src 'none'",
              "frame-src 'self' https://vercel.live",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
