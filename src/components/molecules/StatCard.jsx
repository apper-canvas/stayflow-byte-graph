import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ title, value, icon, trend, trendValue, color = 'primary' }) => {
  const colorClasses = {
    primary: 'from-primary to-blue-700',
    secondary: 'from-secondary to-yellow-600',
    accent: 'from-accent to-green-600',
    error: 'from-error to-red-600',
    warning: 'from-warning to-orange-500',
    info: 'from-info to-blue-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <Card shadow="large" padding="medium" className="relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${colorClasses[color]} opacity-10 rounded-bl-full`}></div>
        
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]} bg-opacity-10`}>
              <ApperIcon name={icon} className={`w-6 h-6 text-${color}`} />
            </div>
            {trend && (
              <div className={`flex items-center text-sm ${trend === 'up' ? 'text-success' : 'text-error'}`}>
                <ApperIcon 
                  name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                  className="w-4 h-4 mr-1" 
                />
                {trendValue}
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-600">{title}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;