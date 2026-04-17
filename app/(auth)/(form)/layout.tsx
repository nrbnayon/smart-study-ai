import React, { Suspense } from "react";
import { AuthSkeleton } from "@/components/Skeleton/AuthSkeleton";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen lg:h-screen w-full flex bg-background lg:overflow-hidden">
      <Suspense fallback={<AuthSkeleton />}>{children}</Suspense>
    </main>
  );
}
