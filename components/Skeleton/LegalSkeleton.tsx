import { Skeleton } from "@/components/ui/skeleton";

export function LegalSkeleton() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] py-12 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Top Navigation Skeleton */}
        <div className="flex justify-between items-center mb-12">
          <Skeleton className="h-10 w-28 rounded-full" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>

        {/* Header Skeleton */}
        <div className="flex flex-col items-center space-y-6">
          <Skeleton className="h-12 w-40 rounded-xl" /> {/* Logo */}
          <Skeleton className="h-12 w-80" /> {/* Title */}
          <Skeleton className="h-5 w-48 rounded-full" />  {/* Updated Date */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
          {/* Sidebar Skeleton */}
          <aside className="hidden lg:block space-y-3 sticky top-12 self-start p-4 bg-white/50 rounded-2xl border border-dashed">
            <Skeleton className="h-3 w-20 mb-4 mx-2" /> {/* Label */}
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-full rounded-xl" />
            ))}
          </aside>

          {/* Content Area Skeleton */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-100 p-8 md:p-16 rounded-[2.5rem] shadow-sm space-y-16">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start gap-6">
                  <Skeleton className="h-12 w-12 rounded-2xl shrink-0" /> {/* Icon Box */}
                  <div className="space-y-4 w-full">
                    <Skeleton className="h-8 w-1/3 rounded-lg" /> {/* Title */}
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full rounded" />
                      <Skeleton className="h-4 w-[95%] rounded" />
                      <Skeleton className="h-4 w-[85%] rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Nav Skeleton */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-12 border-t border-gray-100">
          <Skeleton className="h-14 w-44 rounded-full" />
          <Skeleton className="h-14 w-44 rounded-full" />
        </div>
      </div>
    </div>
  );
}
