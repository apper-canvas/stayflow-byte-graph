import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import RoomCard from '@/components/molecules/RoomCard';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { roomService } from '@/services/api/roomService';
import { toast } from 'react-toastify';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await roomService.getAll();
      setRooms(data);
    } catch (err) {
      setError(err.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleStatusChange = async (roomId, newStatus) => {
    try {
      await roomService.updateStatus(roomId, newStatus);
      setRooms(prev => prev.map(room => 
        room.Id === roomId ? { ...room, status: newStatus } : room
      ));
      toast.success(`Room ${rooms.find(r => r.Id === roomId)?.number} status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update room status');
    }
  };

  const handleViewDetails = (room) => {
    toast.info(`Viewing details for Room ${room.number}`);
  };

  const filteredRooms = rooms.filter(room => {
    const statusMatch = filterStatus === 'all' || room.status === filterStatus;
    const typeMatch = filterType === 'all' || room.type === filterType;
    return statusMatch && typeMatch;
  });

  if (loading) return <Loading type="grid" />;
  if (error) return <Error message={error} onRetry={loadRooms} />;

  const statusCounts = rooms.reduce((acc, room) => {
    acc[room.status] = (acc[room.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 text-display">Room Management</h1>
          <p className="text-gray-600 mt-1">Manage all hotel rooms and their status</p>
        </div>
        <Button variant="primary" icon="Plus">
          Add New Room
        </Button>
      </div>

      {/* Status Summary */}
      <div className="flex flex-wrap gap-4 p-4 bg-gradient-to-r from-surface to-gray-100 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-accent to-green-600 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">
            Available: {statusCounts.available || 0}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-error to-red-600 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">
            Occupied: {statusCounts.occupied || 0}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-warning to-orange-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">
            Cleaning: {statusCounts.cleaning || 0}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">
            Maintenance: {statusCounts.maintenance || 0}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-info to-blue-600 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">
            Reserved: {statusCounts.reserved || 0}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="cleaning">Cleaning</option>
            <option value="maintenance">Maintenance</option>
            <option value="reserved">Reserved</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Type:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none bg-white"
          >
            <option value="all">All Types</option>
            <option value="standard">Standard</option>
            <option value="deluxe">Deluxe</option>
            <option value="suite">Suite</option>
          </select>
        </div>
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length === 0 ? (
        <Empty 
          title="No rooms found"
          description="No rooms match your current filters or there are no rooms in the system"
          icon="Home"
          action={() => {
            setFilterStatus('all');
            setFilterType('all');
          }}
          actionLabel="Clear Filters"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.Id}
              room={room}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Rooms;