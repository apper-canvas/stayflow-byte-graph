import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Header = ({ onMenuToggle, title = 'Dashboard' }) => {
  const [searchValue, setSearchValue] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      type: 'checkin',
      title: 'New Check-in',
      message: 'John Smith has checked into Room 205',
      time: '2 minutes ago',
      unread: true
    },
    {
      id: 2,
      type: 'reservation',
      title: 'Reservation Confirmed',
      message: 'Booking for Room 301 on Dec 15th confirmed',
      time: '15 minutes ago',
      unread: true
    },
    {
      id: 3,
      type: 'maintenance',
      title: 'Maintenance Alert',
      message: 'Room 102 AC unit needs attention',
      time: '1 hour ago',
      unread: false
    }
  ];

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'checkin': return 'UserCheck';
      case 'reservation': return 'Calendar';
      case 'maintenance': return 'AlertCircle';
      default: return 'Bell';
    }
  };

  const NotificationDropdown = () => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
              notification.unread ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${
                notification.type === 'checkin' ? 'bg-accent/10 text-accent' :
                notification.type === 'reservation' ? 'bg-primary/10 text-primary' :
                'bg-warning/10 text-warning'
              }`}>
                <ApperIcon name={getNotificationIcon(notification.type)} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900 text-sm">
                    {notification.title}
                  </p>
                  {notification.unread && (
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {notification.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t border-gray-200">
        <button className="w-full text-center text-sm text-primary hover:text-primary/80 font-medium">
          View All Notifications
        </button>
      </div>
    </motion.div>
  );

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
<div className="relative" ref={notificationRef}>
            <Button 
              variant="ghost" 
              size="small" 
              icon="Bell" 
              className="relative"
              onClick={handleNotificationClick}
            >
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
            
            {showNotifications && <NotificationDropdown />}
          </div>
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
            A
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;