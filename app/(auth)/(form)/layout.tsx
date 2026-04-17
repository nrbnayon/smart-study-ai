import React, { Suspense } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen lg:h-screen w-full flex bg-background lg:overflow-hidden flex justify-center items-center border">
      <Suspense
        fallback={
          <div className="flex h-screen w-full items-center justify-center">
            Loading...
          </div>
        }
      >
        {children}
      </Suspense>
    </main>
  );
}
