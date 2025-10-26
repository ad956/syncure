import { motion } from "framer-motion";

export default function CalendarSkeleton() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-[320px]">
          {/* Calendar Header */}
          <div className="flex justify-between items-center mb-4">
            <motion.div 
              className="h-4 w-16 bg-gray-200 rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div 
              className="h-4 w-20 bg-gray-200 rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
          </div>
          
          {/* Calendar Grid */}
          <div className="space-y-2">
            {/* Week headers */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="h-6 w-8 bg-gray-200 rounded mx-auto"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
            
            {/* Calendar days */}
            {Array.from({ length: 5 }).map((_, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1">
                {Array.from({ length: 7 }).map((_, dayIndex) => (
                  <motion.div
                    key={dayIndex}
                    className="h-8 w-8 bg-gray-200 rounded mx-auto"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      delay: (weekIndex * 7 + dayIndex) * 0.05 
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}