import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { reservationService } from '@/services/api/reservationService';
import { guestService } from '@/services/api/guestService';
import { roomService } from '@/services/api/roomService';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [reservationsData, guestsData, roomsData] = await Promise.all([
        reservationService.getAll(),
        guestService.getAll(),
        roomService.getAll()
      ]);
      
      setReservations(reservationsData);
      setGuests(guestsData);
      setRooms(roomsData);
    } catch (err) {
      setError(err.message || 'Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getGuestName = (guestId) => {
    const guest = guests.find(g => g.Id.toString() === guestId);
    return guest ? guest.name : 'Unknown Guest';
  };

  const getRoomNumber = (roomId) => {
    const room = rooms.find(r => r.Id.toString() === roomId);
    return room ? room.number : 'Unknown Room';
  };

  const getStatusVariant = (status) => {
    const variants = {
      confirmed: 'primary',
      'checked-in': 'accent',
      'checked-out': 'success',
      cancelled: 'error',
      pending: 'warning'
    };
    return variants[status] || 'default';
  };

  const handleStatusUpdate = async (reservationId, newStatus) => {
    try {
      await reservationService.update(reservationId, { status: newStatus });
      setReservations(prev => prev.map(res => 
        res.Id === reservationId ? { ...res, status: newStatus } : res
      ));
      toast.success(`Reservation status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update reservation status');
    }
  };

  const filteredReservations = reservations.filter(reservation => 
    filterStatus === 'all' || reservation.status === filterStatus
  );

  if (loading) return <Loading type="list" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 text-display">Reservations</h1>
          <p className="text-gray-600 mt-1">Manage all hotel reservations and bookings</p>
        </div>
        <Button variant="primary" icon="Plus">
          New Reservation
        </Button>
      </div>

      {/* Filter */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Filter by status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none bg-white"
        >
          <option value="all">All Reservations</option>
          <option value="confirmed">Confirmed</option>
          <option value="checked-in">Checked In</option>
          <option value="checked-out">Checked Out</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Reservations List */}
      {filteredReservations.length === 0 ? (
        <Empty 
          title="No reservations found"
          description="No reservations match your current filters or there are no reservations in the system"
          icon="Calendar"
          action={() => setFilterStatus('all')}
          actionLabel="Clear Filters"
        />
      ) : (
        <div className="space-y-4">
          {filteredReservations.map((reservation) => (
            <motion.div
              key={reservation.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
            >
              <Card hover shadow="medium" padding="medium">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Guest & Room Info */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {getGuestName(reservation.guestId)}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <ApperIcon name="Home" className="w-4 h-4 mr-1" />
                        Room {getRoomNumber(reservation.roomId)}
                      </div>
                    </div>

                    {/* Dates */}
                    <div>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                        Check-in
                      </div>
                      <div className="font-medium text-gray-900">
                        {format(new Date(reservation.checkIn), 'MMM dd, yyyy')}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                        Check-out
                      </div>
                      <div className="font-medium text-gray-900">
                        {format(new Date(reservation.checkOut), 'MMM dd, yyyy')}
                      </div>
                    </div>

                    {/* Amount */}
                    <div>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <ApperIcon name="DollarSign" className="w-4 h-4 mr-1" />
                        Total Amount
                      </div>
                      <div className="font-bold text-lg text-gray-900">
                        ${reservation.totalAmount}
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col items-end space-y-3">
                    <Badge variant={getStatusVariant(reservation.status)} size="medium">
                      {reservation.status}
                    </Badge>
                    
                    <div className="flex space-x-2">
                      {reservation.status === 'confirmed' && (
                        <Button 
                          variant="accent" 
                          size="small"
                          onClick={() => handleStatusUpdate(reservation.Id, 'checked-in')}
                        >
                          Check In
                        </Button>
                      )}
                      {reservation.status === 'checked-in' && (
                        <Button 
                          variant="secondary" 
                          size="small"
                          onClick={() => handleStatusUpdate(reservation.Id, 'checked-out')}
                        >
                          Check Out
                        </Button>
                      )}
                      <Button variant="outline" size="small">
                        Details
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {reservation.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-start space-x-2">
                      <ApperIcon name="FileText" className="w-4 h-4 text-gray-400 mt-0.5" />
                      <p className="text-sm text-gray-600">{reservation.notes}</p>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Reservations;