import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = ({ 
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  required = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const inputClasses = `
    w-full px-4 py-3 border-2 rounded-lg transition-all duration-200
    ${icon ? 'pl-12' : ''}
    ${error 
      ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20' 
      : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
    }
    ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
    placeholder-gray-400 text-gray-900
    ${className}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;