import { Skeleton } from "@/components/ui/skeleton";
import { LakeGridSkeleton } from "./LakeGridSkeleton";
import { CatchGridSkeleton } from "./CatchGridSkeleton";

export function LandingSkeleton() {
  return (
    <div className="w-full bg-white">
      {/* Navbar Placeholder */}
      <div className="h-20 w-full border-b border-gray-100 flex items-center px-8">
        <Skeleton className="h-10 w-32" />
        <div className="ml-auto flex gap-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="container-1620 py-20">
        <div className="flex flex-col items-center text-center space-y-6">
          <Skeleton className="h-8 w-48 rounded-full" />
          <Skeleton className="h-16 w-3/4 max-w-3xl" />
          <Skeleton className="h-20 w-1/2 max-w-2xl" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-40 rounded-xl" />
            <Skeleton className="h-12 w-40 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Dynamic Sections Skeletons */}
      <div className="container-1620 py-20 space-y-20">
        <section>
          <div className="flex flex-col items-center mb-10 space-y-4">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-10 w-64" />
          </div>
          <LakeGridSkeleton count={4} />
        </section>

        <section>
          <div className="flex flex-col items-center mb-10 space-y-4">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-10 w-64" />
          </div>
          <CatchGridSkeleton count={4} />
        </section>
      </div>
    </div>
  );
}
