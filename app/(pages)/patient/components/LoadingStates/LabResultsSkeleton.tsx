import { motion } from "framer-motion";

export default function LabResultsSkeleton() {
  return (
    <div className="h-full space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <motion.div
          key={index}
          className="p-3 border border-gray-200 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex justify-between items-start mb-2">
            <motion.div 
              className="h-4 w-24 bg-gray-200 rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
            />
            <motion.div 
              className="h-3 w-16 bg-gray-200 rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 + 0.1 }}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <motion.div 
              className="h-6 w-12 bg-gray-200 rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 + 0.2 }}
            />
            <motion.div 
              className="h-4 w-20 bg-gray-200 rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 + 0.3 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}