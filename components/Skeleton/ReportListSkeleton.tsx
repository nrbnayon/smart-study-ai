
export const ReportListSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="flex flex-col gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl p-6 border border-[#F3F4F6] shadow-sm animate-pulse"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100" />
              <div className="flex flex-col gap-2">
                <div className="h-4 w-24 bg-gray-100 rounded" />
                <div className="h-3 w-32 bg-gray-50 rounded" />
              </div>
            </div>
            <div className="h-4 w-20 bg-gray-100 rounded" />
          </div>

          {/* Conditions Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="h-16 w-full bg-gray-50 rounded-2xl" />
            <div className="h-16 w-full bg-gray-50 rounded-2xl" />
            <div className="h-16 w-full bg-gray-50 rounded-2xl" />
            <div className="h-16 w-full bg-gray-50 rounded-2xl" />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2 mb-6">
            <div className="h-4 w-full bg-gray-50 rounded" />
            <div className="h-4 w-3/4 bg-gray-50 rounded" />
          </div>

          {/* Footer */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-50">
            <div className="h-8 w-24 bg-gray-50 rounded-lg" />
            <div className="h-8 w-24 bg-gray-50 rounded-lg" />
            <div className="flex gap-2 ml-auto">
              <div className="h-8 w-16 bg-gray-50 rounded-lg" />
              <div className="h-8 w-16 bg-gray-50 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
