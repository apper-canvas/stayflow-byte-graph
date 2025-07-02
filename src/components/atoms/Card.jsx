import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'medium',
  shadow = 'medium',
  ...props 
}) => {
  const baseClasses = "bg-white rounded-lg border border-gray-100";
  
  const paddingClasses = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };
  
  const shadowClasses = {
    none: '',
    small: 'shadow-sm',
    medium: 'shadow-md',
    large: 'shadow-lg shadow-gray-200/50'
  };

  const cardClasses = `${baseClasses} ${paddingClasses[padding]} ${shadowClasses[shadow]} ${className}`;

  if (hover) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        className={`${cardClasses} cursor-pointer transition-all duration-200`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;