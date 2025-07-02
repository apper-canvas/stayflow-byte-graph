import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GuestCard from '@/components/molecules/GuestCard';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { guestService } from '@/services/api/guestService';
import { reservationService } from '@/services/api/reservationService';
import { toast } from 'react-toastify';

const Guests = () => {
  const [guests, setGuests] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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
        <Button variant="primary" icon="UserPlus">
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
  );
};

export default Guests;