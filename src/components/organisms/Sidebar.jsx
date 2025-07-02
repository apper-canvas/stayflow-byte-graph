import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Sidebar = ({ isOpen, onToggle }) => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
    { name: 'Rooms', href: '/rooms', icon: 'Home' },
    { name: 'Reservations', href: '/reservations', icon: 'Calendar' },
    { name: 'Guests', href: '/guests', icon: 'Users' },
    { name: 'Check In', href: '/checkin', icon: 'LogIn' },
    { name: 'Check Out', href: '/checkout', icon: 'LogOut' }
  ];

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-primary">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center h-16 px-6 bg-gradient-to-r from-primary to-blue-800">
            <ApperIcon name="Hotel" className="h-8 w-8 text-secondary mr-3" />
            <span className="text-xl font-bold text-white text-display">StayFlow</span>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-secondary to-yellow-600 text-white shadow-lg'
                      : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                  }`
                }
              >
                <ApperIcon name={item.icon} className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <motion.div
        variants={sidebarVariants}
        animate={isOpen ? 'open' : 'closed'}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-primary lg:hidden"
      >
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-primary to-blue-800">
            <div className="flex items-center">
              <ApperIcon name="Hotel" className="h-8 w-8 text-secondary mr-3" />
              <span className="text-xl font-bold text-white text-display">StayFlow</span>
            </div>
            <button
              onClick={onToggle}
              className="text-blue-100 hover:text-white p-1"
            >
              <ApperIcon name="X" className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onToggle}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-secondary to-yellow-600 text-white shadow-lg'
                      : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                  }`
                }
              >
                <ApperIcon name={item.icon} className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;