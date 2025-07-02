import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const GuestCard = ({ guest, currentReservation, onViewProfile }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <Card hover shadow="medium" padding="medium">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {guest.name.charAt(0)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {guest.name}
              </h3>
              {currentReservation && (
                <Badge variant="success" size="small">
                  Current Guest
                </Badge>
              )}
            </div>
            
            <div className="space-y-1 mb-3">
              <div className="flex items-center text-sm text-gray-600">
                <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
                {guest.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
                {guest.phone}
              </div>
              {currentReservation && (
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Home" className="w-4 h-4 mr-2" />
                  Room {currentReservation.roomNumber}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {guest.bookingHistory?.length || 0} previous stays
              </span>
              <Button 
                variant="ghost" 
                size="small" 
                onClick={() => onViewProfile(guest)}
              >
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default GuestCard;