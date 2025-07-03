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
    toast.info(`Viewing profile for ${guest.name}`);
  };

  const getCurrentReservation = (guestId) => {
    return reservations.find(res => 
      res.guestId === guestId.toString() && 
      (res.status === 'checked-in' || res.status === 'confirmed')
    );
  };

  const filteredGuests = guests.filter(guest => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      guest.name.toLowerCase().includes(query) ||
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
</motion.div>

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
                await guestService.create(formData);
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
  </motion.div>
  );
};

export default GuestsPage;