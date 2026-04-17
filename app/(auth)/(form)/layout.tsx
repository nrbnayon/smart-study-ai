import React, { Suspense } from "react";


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen lg:h-screen w-full flex justify-center items-center bg-background lg:overflow-hidden">
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
    </main>
  );
}
