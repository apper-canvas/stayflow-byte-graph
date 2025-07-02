import React from 'react';

const Badge = ({ children, variant = 'default', size = 'medium', className = '' }) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    available: "bg-gradient-to-r from-accent to-green-600 text-white",
    occupied: "bg-gradient-to-r from-error to-red-600 text-white",
    cleaning: "bg-gradient-to-r from-warning to-orange-500 text-white",
    maintenance: "bg-gradient-to-r from-gray-500 to-gray-600 text-white",
    reserved: "bg-gradient-to-r from-info to-blue-600 text-white",
    success: "bg-gradient-to-r from-success to-green-600 text-white",
    primary: "bg-gradient-to-r from-primary to-blue-700 text-white",
    secondary: "bg-gradient-to-r from-secondary to-yellow-600 text-white"
  };
  
  const sizes = {
    small: "px-2 py-1 text-xs",
    medium: "px-3 py-1.5 text-sm",
    large: "px-4 py-2 text-base"
  };

  const badgeClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <span className={badgeClasses}>
      {children}
    </span>
  );
};

export default Badge;