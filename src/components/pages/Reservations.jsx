import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import { roomService } from "@/services/api/roomService";
import { reservationService } from "@/services/api/reservationService";
import { guestService } from "@/services/api/guestService";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    guestId: '',
    roomId: '',
    checkIn: '',
    checkOut: '',
    totalAmount: '',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});
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

  const resetForm = () => {
    setFormData({
      guestId: '',
      roomId: '',
      checkIn: '',
      checkOut: '',
      totalAmount: '',
      notes: ''
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.guestId) errors.guestId = 'Guest is required';
    if (!formData.roomId) errors.roomId = 'Room is required';
    if (!formData.checkIn) errors.checkIn = 'Check-in date is required';
    if (!formData.checkOut) errors.checkOut = 'Check-out date is required';
    if (!formData.totalAmount) errors.totalAmount = 'Total amount is required';
    
    if (formData.checkIn && formData.checkOut) {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (checkInDate < today) {
        errors.checkIn = 'Check-in date cannot be in the past';
      }
      
      if (checkOutDate <= checkInDate) {
        errors.checkOut = 'Check-out date must be after check-in date';
      }
    }
    
    if (formData.totalAmount && (isNaN(formData.totalAmount) || parseFloat(formData.totalAmount) <= 0)) {
      errors.totalAmount = 'Total amount must be a valid positive number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateReservation = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      
      const newReservation = {
        ...formData,
        guestId: formData.guestId.toString(),
        roomId: formData.roomId.toString(),
        totalAmount: parseFloat(formData.totalAmount),
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      
      const createdReservation = await reservationService.create(newReservation);
      
      setReservations(prev => [createdReservation, ...prev]);
      setShowModal(false);
      resetForm();
      toast.success('Reservation created successfully');
    } catch (err) {
      toast.error('Failed to create reservation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
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
        <Button variant="primary" icon="Plus" onClick={() => setShowModal(true)}>
          New Reservation
        </Button>
      </div>
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
      {/* New Reservation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 text-display">New Reservation</h2>
              <button
                onClick={handleModalClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ApperIcon name="X" className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateReservation} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Guest Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guest *
                  </label>
                  <select
                    value={formData.guestId}
                    onChange={(e) => setFormData(prev => ({ ...prev, guestId: e.target.value }))}
                    className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                      formErrors.guestId ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                  >
                    <option value="">Select a guest...</option>
                    {guests.map(guest => (
                      <option key={guest.Id} value={guest.Id}>
                        {guest.name} - {guest.email}
                      </option>
                    ))}
                  </select>
                  {formErrors.guestId && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.guestId}</p>
                  )}
                </div>

                {/* Room Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room *
                  </label>
                  <select
                    value={formData.roomId}
                    onChange={(e) => setFormData(prev => ({ ...prev, roomId: e.target.value }))}
                    className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                      formErrors.roomId ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                  >
                    <option value="">Select a room...</option>
                    {rooms.filter(room => room.status === 'available').map(room => (
                      <option key={room.Id} value={room.Id}>
                        Room {room.number} - {room.type} (${room.price}/night)
                      </option>
                    ))}
                  </select>
                  {formErrors.roomId && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.roomId}</p>
                  )}
                </div>

                {/* Check-in Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    value={formData.checkIn}
                    onChange={(e) => setFormData(prev => ({ ...prev, checkIn: e.target.value }))}
                    className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                      formErrors.checkIn ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                  />
                  {formErrors.checkIn && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.checkIn}</p>
                  )}
                </div>

                {/* Check-out Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Date *
                  </label>
                  <input
                    type="date"
                    value={formData.checkOut}
                    onChange={(e) => setFormData(prev => ({ ...prev, checkOut: e.target.value }))}
                    className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                      formErrors.checkOut ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                  />
                  {formErrors.checkOut && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.checkOut}</p>
                  )}
                </div>

                {/* Total Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Amount ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalAmount: e.target.value }))}
                    className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                      formErrors.totalAmount ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                    placeholder="0.00"
                  />
                  {formErrors.totalAmount && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.totalAmount}</p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows="3"
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                  placeholder="Any special requests or notes..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleModalClose}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitting}
                  icon={submitting ? "Loader2" : "Plus"}
                >
                  {submitting ? 'Creating...' : 'Create Reservation'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
)}
  </motion.div>
  );
};

export default Reservations;