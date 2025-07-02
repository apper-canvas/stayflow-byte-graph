import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  icon,
  loading = false,
  disabled = false,
  onClick,
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-blue-700 text-white hover:shadow-lg focus:ring-primary/50 disabled:opacity-50",
    secondary: "bg-gradient-to-r from-secondary to-yellow-600 text-white hover:shadow-lg focus:ring-secondary/50 disabled:opacity-50",
    accent: "bg-gradient-to-r from-accent to-green-600 text-white hover:shadow-lg focus:ring-accent/50 disabled:opacity-50",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50 disabled:opacity-50",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-300 disabled:opacity-50"
  };
  
  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base"
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
      )}
      {icon && !loading && (
        <ApperIcon name={icon} className="w-4 h-4 mr-2" />
      )}
      {children}
    </motion.button>
  );
};

export default Button;