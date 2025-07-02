import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { reservationService } from '@/services/api/reservationService';
import { guestService } from '@/services/api/guestService';
import { roomService } from '@/services/api/roomService';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const CheckIn = () => {
  const [reservations, setReservations] = useState([]);
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReservation, setSelectedReservation] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [reservationsData, guestsData, roomsData] = await Promise.all([
        reservationService.getByStatus('confirmed'),
        guestService.getAll(),
        roomService.getAll()
      ]);
      
      setReservations(reservationsData);
      setGuests(guestsData);
      setRooms(roomsData);
    } catch (err) {
      setError(err.message || 'Failed to load check-in data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getGuestDetails = (guestId) => {
    return guests.find(g => g.Id.toString() === guestId);
  };

  const getRoomDetails = (roomId) => {
    return rooms.find(r => r.Id.toString() === roomId);
  };

  const handleCheckIn = async (reservation) => {
    try {
      // Update reservation status
      await reservationService.update(reservation.Id, { status: 'checked-in' });
      
      // Update room status
      await roomService.updateStatus(parseInt(reservation.roomId), 'occupied');
      
      // Remove from the list
      setReservations(prev => prev.filter(r => r.Id !== reservation.Id));
      
      toast.success(`Successfully checked in ${getGuestDetails(reservation.guestId)?.name}`);
      setSelectedReservation(null);
    } catch (err) {
      toast.error('Failed to check in guest');
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    if (!searchQuery) return true;
    const guest = getGuestDetails(reservation.guestId);
    const room = getRoomDetails(reservation.roomId);
    const query = searchQuery.toLowerCase();
    
    return (
      guest?.name.toLowerCase().includes(query) ||
      guest?.email.toLowerCase().includes(query) ||
      room?.number.includes(query) ||
      reservation.Id.toString().includes(query)
    );
  });

  const todayArrivals = reservations.filter(res => 
    new Date(res.checkIn).toDateString() === new Date().toDateString()
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
          <h1 className="text-3xl font-bold text-gray-900 text-display">Guest Check-In</h1>
          <p className="text-gray-600 mt-1">Process guest arrivals and room assignments</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="info" size="large">
            <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
            {todayArrivals.length} arrivals today
          </Badge>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search by guest name, email, room number, or reservation ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon="Search"
          />
        </div>
        <Button variant="secondary" icon="RefreshCw" onClick={loadData}>
          Refresh
        </Button>
      </div>

      {/* Reservations List */}
      {filteredReservations.length === 0 ? (
        <Empty 
          title="No reservations for check-in"
          description={searchQuery ? 
            "No reservations match your search criteria" : 
            "All confirmed reservations have been processed or there are no arrivals"
          }
          icon="LogIn"
          action={searchQuery ? () => setSearchQuery('') : undefined}
          actionLabel={searchQuery ? "Clear Search" : undefined}
        />
      ) : (
        <div className="space-y-4">
          {filteredReservations.map((reservation) => {
            const guest = getGuestDetails(reservation.guestId);
            const room = getRoomDetails(reservation.roomId);
            const isToday = new Date(reservation.checkIn).toDateString() === new Date().toDateString();
            
            return (
              <motion.div
                key={reservation.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
              >
                <Card hover shadow="medium" padding="medium">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Guest Info */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                            {guest?.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{guest?.name}</h3>
                            <p className="text-sm text-gray-600">{guest?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <ApperIcon name="Phone" className="w-4 h-4 mr-1" />
                          {guest?.phone}
                        </div>
                      </div>

                      {/* Room & Dates */}
                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <ApperIcon name="Home" className="w-4 h-4 mr-1" />
                          Room Details
                        </div>
                        <div className="font-medium text-gray-900 mb-1">
                          Room {room?.number} ({room?.type})
                        </div>
                        <div className="text-sm text-gray-600">
                          Floor {room?.floor} • ${room?.rate}/night
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                          Stay Duration
                        </div>
                        <div className="font-medium text-gray-900 mb-1">
                          {format(new Date(reservation.checkIn), 'MMM dd')} - {format(new Date(reservation.checkOut), 'MMM dd')}
                        </div>
                        <div className="text-sm text-gray-600">
                          Total: ${reservation.totalAmount}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end space-y-3">
                      {isToday && (
                        <Badge variant="warning" size="small">
                          <ApperIcon name="Clock" className="w-3 h-3 mr-1" />
                          Today's Arrival
                        </Badge>
                      )}
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="primary" 
                          size="medium"
                          icon="LogIn"
                          onClick={() => handleCheckIn(reservation)}
                        >
                          Check In
                        </Button>
                        <Button 
                          variant="outline" 
                          size="medium"
                          onClick={() => setSelectedReservation(reservation)}
                        >
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
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default CheckIn;