import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatCard from '@/components/molecules/StatCard';
import RoomCard from '@/components/molecules/RoomCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { roomService } from '@/services/api/roomService';
import { reservationService } from '@/services/api/reservationService';
import { guestService } from '@/services/api/guestService';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [roomsData, reservationsData, guestsData] = await Promise.all([
        roomService.getAll(),
        reservationService.getAll(),
        guestService.getAll()
      ]);
      
      setRooms(roomsData);
      setReservations(reservationsData);
      setGuests(guestsData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
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

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const stats = {
    totalRooms: rooms.length,
    availableRooms: rooms.filter(r => r.status === 'available').length,
    occupiedRooms: rooms.filter(r => r.status === 'occupied').length,
    todayArrivals: reservations.filter(r => 
      new Date(r.checkIn).toDateString() === new Date().toDateString()
    ).length,
    todayDepartures: reservations.filter(r => 
      new Date(r.checkOut).toDateString() === new Date().toDateString()
    ).length,
    occupancyRate: Math.round((rooms.filter(r => r.status === 'occupied').length / rooms.length) * 100)
  };

  const recentRooms = rooms.slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Rooms"
          value={stats.totalRooms}
          icon="Home"
          color="primary"
        />
        <StatCard
          title="Available Rooms"
          value={stats.availableRooms}
          icon="Check"
          color="accent"
        />
        <StatCard
          title="Occupied Rooms"
          value={stats.occupiedRooms}
          icon="User"
          color="error"
        />
        <StatCard
          title="Occupancy Rate"
          value={`${stats.occupancyRate}%`}
          icon="TrendingUp"
          color="secondary"
          trend={stats.occupancyRate > 75 ? 'up' : 'down'}
          trendValue={`${stats.occupancyRate > 75 ? '+' : '-'}${Math.abs(stats.occupancyRate - 75)}%`}
        />
      </div>

      {/* Today's Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Today's Arrivals"
          value={stats.todayArrivals}
          icon="LogIn"
          color="info"
        />
        <StatCard
          title="Today's Departures"
          value={stats.todayDepartures}
          icon="LogOut"
          color="warning"
        />
      </div>

      {/* Room Status Overview */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 text-display">Room Status Overview</h2>
          <div className="flex space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gradient-to-r from-accent to-green-600 text-white">
              {stats.availableRooms} Available
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gradient-to-r from-error to-red-600 text-white">
              {stats.occupiedRooms} Occupied
            </span>
          </div>
        </div>

        {recentRooms.length === 0 ? (
          <Empty 
            title="No rooms found"
            description="Start by adding rooms to your hotel inventory"
            icon="Home"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentRooms.map((room) => (
              <RoomCard
                key={room.Id}
                room={room}
                onStatusChange={handleStatusChange}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;