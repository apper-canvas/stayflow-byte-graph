import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import GuestCard from "@/components/molecules/GuestCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Reservations from "@/components/pages/Reservations";
import roomsData from "@/services/mockData/rooms.json";
import guestsData from "@/services/mockData/guests.json";
import reservationsData from "@/services/mockData/reservations.json";
import { reservationService } from "@/services/api/reservationService";
import { guestService } from "@/services/api/guestService";

const GuestsPage = () => {
  const [guests, setGuests] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [guestsData, reservationsData] = await Promise.all([
        guestService.getAll(),
        reservationService.getAll()
      ]);
      
      setGuests(guestsData);
      setReservations(reservationsData);
    } catch (err) {
      setError(err.message || 'Failed to load guests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

const handleViewProfile = (guest) => {
    setSelectedGuest(guest);
    setShowProfileModal(true);
  };

const getCurrentReservation = (guestId) => {
    return reservations.find(res => 
      res.guest_id === guestId.toString() && 
      (res.status === 'checked-in' || res.status === 'confirmed')
    );
  };

  const filteredGuests = guests.filter(guest => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
return (
      guest.Name.toLowerCase().includes(query) ||
      guest.email.toLowerCase().includes(query) ||
      guest.phone.includes(query)
    );
  });

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
          <h1 className="text-3xl font-bold text-gray-900 text-display">Guest Directory</h1>
          <p className="text-gray-600 mt-1">Manage guest profiles and booking history</p>
        </div>
        <Button variant="primary" icon="UserPlus" onClick={() => setShowModal(true)}>
          Add New Guest
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search guests by name, email, or phone..."
          className="w-full sm:max-w-md"
        />
        
        <div className="text-sm text-gray-600">
          {filteredGuests.length} of {guests.length} guests
        </div>
      </div>

      {/* Guest Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-surface to-gray-100 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{guests.length}</div>
          <div className="text-sm text-gray-600">Total Guests</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent">
            {reservations.filter(r => r.status === 'checked-in').length}
          </div>
          <div className="text-sm text-gray-600">Current Guests</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary">
            {guests.filter(g => g.bookingHistory && g.bookingHistory.length > 1).length}
          </div>
          <div className="text-sm text-gray-600">Returning Guests</div>
        </div>
      </div>

      {/* Guests List */}
      {filteredGuests.length === 0 ? (
        <Empty 
          title={searchQuery ? "No guests found" : "No guests in directory"}
          description={searchQuery ? 
            "No guests match your search criteria. Try a different search term." : 
            "Start by adding guests to your hotel directory"
          }
          icon="Users"
          action={searchQuery ? () => setSearchQuery('') : undefined}
          actionLabel={searchQuery ? "Clear Search" : "Add First Guest"}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuests.map((guest) => (
            <GuestCard
              key={guest.Id}
              guest={guest}
              currentReservation={getCurrentReservation(guest.Id)}
              onViewProfile={handleViewProfile}
/>
          ))}
        </div>
      )}
      {/* Add Guest Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Add New Guest</h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ name: '', email: '', phone: '' });
                    setFormErrors({});
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                
                // Validate form
                const errors = {};
                if (!formData.name.trim()) errors.name = 'Name is required';
                if (!formData.email.trim()) errors.email = 'Email is required';
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                  errors.email = 'Please enter a valid email address';
                }
                if (!formData.phone.trim()) errors.phone = 'Phone is required';
                else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
                  errors.phone = 'Please enter a valid phone number';
                }

                if (Object.keys(errors).length > 0) {
                  setFormErrors(errors);
                  return;
                }

                try {
                  setIsSubmitting(true);
await guestService.create({
                    Name: formData.name,
                    email: formData.email,
                    phone: formData.phone
                  });
                  toast.success('Guest added successfully!');
                  setShowModal(false);
                  setFormData({ name: '', email: '', phone: '' });
                  setFormErrors({});
                  await loadData(); // Refresh the guest list
                } catch (error) {
                  toast.error(error.message || 'Failed to add guest');
                } finally {
                  setIsSubmitting(false);
                }
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                      }}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                        formErrors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter guest's full name"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                      }}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter email address"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                      }}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                        formErrors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter phone number"
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowModal(false);
                      setFormData({ name: '', email: '', phone: '' });
                      setFormErrors({});
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Adding...' : 'Add Guest'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
)}

      {/* Guest Profile Modal */}
      {showProfileModal && selectedGuest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 text-display">Guest Profile</h2>
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    setSelectedGuest(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ApperIcon name="X" size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Guest Information */}
                <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-lg text-white">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" size={32} />
                    </div>
                    <div>
<h3 className="text-xl font-bold">{selectedGuest.Name}</h3>
                      <p className="text-white text-opacity-90">{selectedGuest.email}</p>
                      <p className="text-white text-opacity-90">{selectedGuest.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Current Reservation Status */}
                {(() => {
                  const currentReservation = getCurrentReservation(selectedGuest.Id);
                  return currentReservation ? (
                    <div className="bg-accent bg-opacity-10 border border-accent border-opacity-20 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <ApperIcon name="Calendar" size={20} className="text-accent" />
                        <h4 className="font-semibold text-accent">Current Stay</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Room:</span>
                          <span className="ml-2 font-medium">{currentReservation.roomNumber}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <span className="ml-2 font-medium capitalize">{currentReservation.status}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Check-in:</span>
                          <span className="ml-2 font-medium">{currentReservation.checkIn}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Check-out:</span>
                          <span className="ml-2 font-medium">{currentReservation.checkOut}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Calendar" size={20} className="text-gray-400" />
                        <span className="text-gray-600">No current reservation</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Guest Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-surface rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {selectedGuest.bookingHistory ? selectedGuest.bookingHistory.length : 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Bookings</div>
                  </div>
                  <div className="bg-surface rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-secondary">
{reservations.filter(r => r.guest_id === selectedGuest.Id.toString()).length}
                    </div>
                    <div className="text-sm text-gray-600">Reservations</div>
                  </div>
<div className="bg-surface rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-accent">
                      {selectedGuest.preferredRoom || selectedGuest.preferred_room || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Preferred Room</div>
                  </div>
                  <div className="bg-surface rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-warning">
                      {selectedGuest.loyaltyPoints || selectedGuest.loyalty_points || 0}
                    </div>
                    <div className="text-sm text-gray-600">Loyalty Points</div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <ApperIcon name="Contact" size={20} className="mr-2" />
                    Contact Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Mail" size={16} className="text-gray-400" />
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedGuest.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Phone" size={16} className="text-gray-400" />
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{selectedGuest.phone}</span>
                    </div>
                    {selectedGuest.address && (
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="MapPin" size={16} className="text-gray-400" />
                        <span className="text-gray-600">Address:</span>
                        <span className="font-medium">{selectedGuest.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Booking History */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <ApperIcon name="History" size={20} className="mr-2" />
                    Recent Booking History
                  </h4>
                  <div className="space-y-2">
{reservations
                      .filter(r => r.guest_id === selectedGuest.Id.toString())
                      .slice(0, 5)
                      .map((reservation, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                              <ApperIcon name="Calendar" size={14} className="text-primary" />
                            </div>
                            <div>
<div className="font-medium text-sm">Room {reservation.room_id}</div>
                              <div className="text-xs text-gray-600">
                                {reservation.check_in} - {reservation.check_out}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs font-medium capitalize px-2 py-1 rounded-full bg-primary bg-opacity-10 text-primary">
                            {reservation.status}
                          </div>
                        </div>
                      ))}
{reservations.filter(r => r.guest_id === selectedGuest.Id.toString()).length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        <ApperIcon name="Calendar" size={24} className="mx-auto mb-2 text-gray-400" />
                        <p>No booking history available</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Guest Information */}
{(selectedGuest.special_requests || selectedGuest.notes) && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <ApperIcon name="FileText" size={20} className="mr-2" />
                      Additional Information
                    </h4>
                    <div className="space-y-2 text-sm">
{selectedGuest.special_requests && (
                        <div>
                          <span className="text-gray-600">Special Requests:</span>
                          <p className="text-gray-900 mt-1">{selectedGuest.special_requests}</p>
                        </div>
                      )}
                      {selectedGuest.notes && (
                        <div>
                          <span className="text-gray-600">Notes:</span>
                          <p className="text-gray-900 mt-1">{selectedGuest.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowProfileModal(false);
                    setSelectedGuest(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default GuestsPage;