import { motion } from "framer-motion";

export const ChartSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full space-y-4 animate-pulse flex flex-col justify-end"
    >
      {/* Chart Bars Simulation */}
      <div className="flex items-end justify-between h-[220px] w-full px-4 gap-4">
        {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
          <div
            key={i}
            className="w-full bg-[#E2E8F0] dark:bg-gray-700 rounded-t-lg"
            style={{ height: `${h}%` }}
          ></div>
        ))}
      </div>
      
      {/* Labels Simulation */}
      <div className="flex justify-between w-full px-4 pt-4 border-t border-[#F5F6FA] dark:border-gray-800">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="h-2.5 bg-[#E2E8F0] dark:bg-gray-700 rounded w-8"></div>
        ))}
      </div>
    </motion.div>
  );
};
