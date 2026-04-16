import { Skeleton } from "@/components/ui/skeleton";

export function CatchGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="flex flex-col overflow-hidden rounded-2xl bg-white border border-[#F3F4F6]"
        >
          {/* Card Main Skeleton */}
          <div className="relative h-[300px] w-full">
            <Skeleton className="h-full w-full rounded-none" />
            
            {/* Badges Skeleton */}
            <div className="absolute left-3 top-3 z-10">
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="absolute right-3 top-3 z-10">
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>

            {/* Bottom Content Skeleton */}
            <div className="absolute inset-x-0 bottom-0 p-3 space-y-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>

          {/* Card Meta Footer Skeleton */}
          <div className="my-3 px-2">
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-10" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
