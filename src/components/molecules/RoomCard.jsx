import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const RoomCard = ({ room, onStatusChange, onViewDetails }) => {
  const getStatusIcon = (status) => {
    const icons = {
      available: 'Check',
      occupied: 'User',
      cleaning: 'Sparkles',
      maintenance: 'Settings',
      reserved: 'Clock'
    };
    return icons[status] || 'Home';
  };

  const getStatusVariant = (status) => {
    const variants = {
      available: 'available',
      occupied: 'occupied',
      cleaning: 'cleaning',
      maintenance: 'maintenance',
      reserved: 'reserved'
    };
    return variants[status] || 'default';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card hover shadow="large" padding="medium" className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-bl-full"></div>
        
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Room {room.number}
            </h3>
            <p className="text-sm text-gray-600 capitalize">
              {room.type} • Floor {room.floor}
            </p>
          </div>
          <Badge variant={getStatusVariant(room.status)} size="small">
            <ApperIcon name={getStatusIcon(room.status)} className="w-3 h-3 mr-1" />
            {room.status}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="DollarSign" className="w-4 h-4 mr-2 text-secondary" />
            ${room.rate}/night
          </div>
          {room.features && room.features.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {room.features.slice(0, 3).map((feature, index) => (
                <span key={index} className="text-xs bg-surface px-2 py-1 rounded text-gray-600">
                  {feature}
                </span>
              ))}
              {room.features.length > 3 && (
                <span className="text-xs text-gray-500">+{room.features.length - 3} more</span>
              )}
            </div>
          )}
        </div>

        <div className="flex space-x-2">
<Button 
            variant="outline" 
            size="small" 
            onClick={() => onViewDetails(room)}
            className="flex-1"
          >
            Details
          </Button>
          <select
            value={room.status}
            onChange={(e) => onStatusChange(room.Id, e.target.value)}
            className="px-3 py-1.5 text-sm border-2 border-gray-200 rounded-md focus:border-primary focus:outline-none bg-white"
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="cleaning">Cleaning</option>
            <option value="maintenance">Maintenance</option>
            <option value="reserved">Reserved</option>
          </select>
        </div>
      </Card>
    </motion.div>
  );
};

export default RoomCard;