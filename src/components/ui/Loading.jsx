import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ type = 'grid' }) => {
  if (type === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
              </div>
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
              <div className="flex space-x-1">
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-12"></div>
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded flex-1"></div>
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48"></div>
            </div>
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-12"></div>
          </div>
          <div className="space-y-2">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Loading;