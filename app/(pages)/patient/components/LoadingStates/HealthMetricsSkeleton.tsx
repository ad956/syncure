import { motion } from "framer-motion";

export default function HealthMetricsSkeleton() {
  return (
    <div className="h-full w-full p-4">
      {/* Chart area */}
      <div className="h-[300px] bg-gray-100 rounded-lg mb-4 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-60"
          animate={{ x: [-100, 400] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Simulated chart lines */}
        <div className="absolute inset-4 flex items-end justify-between">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="bg-gray-300 rounded-t w-8"
              style={{ height: `${Math.random() * 60 + 20}%` }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <motion.div 
              className="w-3 h-3 bg-gray-300 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
            />
            <motion.div 
              className="h-3 w-16 bg-gray-200 rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 + 0.1 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}