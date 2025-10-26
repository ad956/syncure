import { motion } from "framer-motion";

export default function BillsSkeleton() {
  return (
    <div className="h-[240px] space-y-1">
      {Array.from({ length: 4 }).map((_, index) => (
        <motion.div
          key={index}
          className="flex items-center justify-between p-2 rounded-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center gap-3 flex-1">
            <motion.div 
              className="w-8 h-8 bg-gray-200 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
            />
            <div className="space-y-1">
              <motion.div 
                className="h-3 w-24 bg-gray-200 rounded"
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
          
          <div className="flex items-center gap-3">
            <div className="text-right space-y-1">
              <motion.div 
                className="h-3 w-16 bg-gray-200 rounded"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 + 0.3 }}
              />
              <motion.div 
                className="h-2 w-12 bg-gray-200 rounded ml-auto"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 + 0.4 }}
              />
            </div>
            <motion.div 
              className="w-4 h-4 bg-gray-200 rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 + 0.5 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}