import { motion } from "framer-motion";

export default function MedicationSkeleton() {
  return (
    <div className="space-y-4">
      <motion.div 
        className="h-6 w-24 bg-gray-200 rounded"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <motion.div
            key={index}
            className="p-2.5 rounded-lg border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 flex-1">
                <motion.div 
                  className="w-8 h-8 bg-gray-200 rounded-lg"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                />
                <div className="flex-1 space-y-1">
                  <motion.div 
                    className="h-3 w-20 bg-gray-200 rounded"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 + 0.1 }}
                  />
                  <motion.div 
                    className="h-2 w-16 bg-gray-200 rounded"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 + 0.2 }}
                  />
                </div>
              </div>
              <motion.div 
                className="h-7 w-14 bg-gray-200 rounded"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 + 0.3 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}