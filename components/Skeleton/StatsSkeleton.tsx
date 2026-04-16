import { motion } from "framer-motion";

export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-card border border-primary/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between  animate-pulse h-36"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="h-4 bg-[#E2E8F0] dark:bg-gray-700 rounded w-24 mb-3"></div>
              <div className="h-8 bg-[#E2E8F0] dark:bg-gray-700 rounded w-16 mb-2"></div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#E2E8F0] dark:bg-gray-700 shrink-0"></div>
          </div>
          <div className="flex items-center gap-2 pt-4 border-t border-[#F5F6FA] dark:border-gray-800">
            <div className="h-3 bg-[#E2E8F0] dark:bg-gray-700 rounded w-32"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
