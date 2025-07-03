import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import { roomService } from "@/services/api/roomService";
import { reservationService } from "@/services/api/reservationService";
import { guestService } from "@/services/api/guestService";

const CheckOut = () => {
  const [reservations, setReservations] = useState([]);
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [reservationsData, guestsData, roomsData] = await Promise.all([
        reservationService.getByStatus('checked-in'),
        guestService.getAll(),
        roomService.getAll()
      ]);
      
      setReservations(reservationsData);
      setGuests(guestsData);
      setRooms(roomsData);
    } catch (err) {
      setError(err.message || 'Failed to load check-out data');
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

  const handleCheckOut = async (reservation) => {
    try {
      // Update reservation status
      await reservationService.update(reservation.Id, { status: 'checked-out' });
      
      // Update room status to cleaning
await roomService.updateStatus(parseInt(reservation.room_id), 'cleaning');
      
      // Remove from the list
      setReservations(prev => prev.filter(r => r.Id !== reservation.Id));
      
toast.success(`Successfully checked out ${getGuestDetails(reservation.guest_id)?.Name}`);
    } catch (err) {
      toast.error('Failed to check out guest');
    }
  };

  const filteredReservations = reservations.filter(reservation => {
if (!searchQuery) return true;
    const guest = getGuestDetails(reservation.guest_id);
    const room = getRoomDetails(reservation.room_id);
    const query = searchQuery.toLowerCase();
    
    return (
      guest?.Name.toLowerCase().includes(query) ||
      guest?.email.toLowerCase().includes(query) ||
      room?.number.includes(query) ||
      reservation.Id.toString().includes(query)
    );
  });

const todayDepartures = reservations.filter(res => 
    new Date(res.check_out).toDateString() === new Date().toDateString()
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
          <h1 className="text-3xl font-bold text-gray-900 text-display">Guest Check-Out</h1>
          <p className="text-gray-600 mt-1">Process guest departures and room turnover</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="warning" size="large">
            <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
            {todayDepartures.length} departures today
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
          title="No guests for check-out"
          description={searchQuery ? 
            "No guests match your search criteria" : 
            "All checked-in guests have been processed or there are no current guests"
          }
          icon="LogOut"
          action={searchQuery ? () => setSearchQuery('') : undefined}
          actionLabel={searchQuery ? "Clear Search" : undefined}
        />
      ) : (
        <div className="space-y-4">
{filteredReservations.map((reservation) => {
            const guest = getGuestDetails(reservation.guest_id);
            const room = getRoomDetails(reservation.room_id);
            const isToday = new Date(reservation.check_out).toDateString() === new Date().toDateString();
            const isOverdue = new Date(reservation.check_out) < new Date();
            
            return (
              <motion.div
                key={reservation.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
              >
                <Card hover shadow="medium" padding="medium" className={isOverdue ? 'border-l-4 border-l-error' : ''}>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Guest Info */}
                      <div>
<div className="flex items-center space-x-2 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                            {guest?.Name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{guest?.Name}</h3>
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
{format(new Date(reservation.check_in), 'MMM dd')} - {format(new Date(reservation.check_out), 'MMM dd')}
                        </div>
                        <div className="text-sm text-gray-600">
                          Total: ${reservation.total_amount}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end space-y-3">
                      <div className="flex flex-col items-end space-y-2">
                        {isOverdue && (
                          <Badge variant="error" size="small">
                            <ApperIcon name="AlertTriangle" className="w-3 h-3 mr-1" />
                            Overdue
                          </Badge>
                        )}
                        {isToday && !isOverdue && (
                          <Badge variant="warning" size="small">
                            <ApperIcon name="Clock" className="w-3 h-3 mr-1" />
                            Today's Departure
                          </Badge>
                        )}
                        <Badge variant="accent" size="small">
                          <ApperIcon name="User" className="w-3 h-3 mr-1" />
                          Currently Checked In
                        </Badge>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="secondary" 
                          size="medium"
                          icon="LogOut"
                          onClick={() => handleCheckOut(reservation)}
                        >
                          Check Out
                        </Button>
                        <Button 
                          variant="outline" 
                          size="medium"
                          icon="Receipt"
                        >
                          Bill
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

export default CheckOut;