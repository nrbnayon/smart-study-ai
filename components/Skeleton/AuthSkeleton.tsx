import { Skeleton } from "@/components/ui/skeleton";

export const AuthSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-background overflow-hidden">
      {/* Left side image skeleton - only visible on lg */}
      <div className="hidden lg:block lg:flex-1 p-8">
        <Skeleton className="w-full h-full rounded-3xl" />
      </div>

      {/* Right side form skeleton */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg space-y-8">
          {/* Logo, Title, Subtitle */}
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-40 mx-auto" />
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-6 w-80 mx-auto" />
          </div>

          {/* Form Card */}
          <div className="p-8 space-y-6 bg-white rounded-[40px] border border-gray-100 shadow-sm">
            <div className="space-y-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="flex justify-center">
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
