import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Header = ({ onMenuToggle, title = 'Dashboard' }) => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="small"
            icon="Menu"
            onClick={onMenuToggle}
            className="lg:hidden"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 text-display">{title}</h1>
            <p className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <SearchBar
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search guests, rooms..."
            className="hidden md:block"
          />
          
          <Button variant="ghost" size="small" icon="Bell" className="relative">
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>
          
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
            A
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;