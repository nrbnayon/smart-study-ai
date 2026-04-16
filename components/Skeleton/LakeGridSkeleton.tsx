import { Skeleton } from "@/components/ui/skeleton";

export function LakeGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100"
        >
          {/* Image Skeleton */}
          <div className="relative aspect-[4/3] w-full">
            <Skeleton className="h-full w-full rounded-none" />
          </div>

          <div className="flex flex-1 flex-col p-5">
            {/* Title Skeleton */}
            <Skeleton className="h-6 w-3/4 mb-4" />
            
            {/* Description Skeleton */}
            <div className="space-y-2 mb-4">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="rounded-xl bg-gray-50 py-3 flex flex-col items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-3 w-10" />
              </div>
              <div className="rounded-xl bg-gray-50 py-3 flex flex-col items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-3 w-10" />
              </div>
              <div className="rounded-xl bg-gray-50 py-3 flex flex-col items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-3 w-10" />
              </div>
            </div>

            {/* Tags Skeleton */}
            <div className="flex gap-1.5 pt-1">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
