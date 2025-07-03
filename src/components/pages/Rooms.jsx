import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import RoomCard from "@/components/molecules/RoomCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import { roomService } from "@/services/api/roomService";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingRate, setEditingRate] = useState('');
  const [editingStatus, setEditingStatus] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    number: '',
    type: 'standard',
    floor: 1,
    rate: '',
    capacity: 1,
    beds: '',
    size: '',
    view: '',
    features: [],
    description: ''
  });
  const [formErrors, setFormErrors] = useState({});
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
    setSelectedRoom(room);
    setShowRoomDetails(true);
    setEditMode(false);
    setEditingRate(room.rate.toString());
    setEditingStatus(room.status);
  };

  const closeRoomDetails = () => {
    setShowRoomDetails(false);
    setSelectedRoom(null);
    setEditMode(false);
    setEditingRate('');
    setEditingStatus('');
  };

  const handleEditRoom = () => {
    setEditMode(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedRoom) return;
    
    try {
      // Update rate if changed
      if (parseFloat(editingRate) !== selectedRoom.rate) {
        const newRate = parseFloat(editingRate);
        if (newRate <= 0) {
          toast.error('Rate must be greater than 0');
          return;
        }
        // Update room in state
        setRooms(prev => prev.map(room => 
          room.Id === selectedRoom.Id ? { ...room, rate: newRate } : room
        ));
        setSelectedRoom(prev => ({ ...prev, rate: newRate }));
        toast.success('Room rate updated successfully');
      }
      
      // Update status if changed
      if (editingStatus !== selectedRoom.status) {
        await handleStatusChange(selectedRoom.Id, editingStatus);
        setSelectedRoom(prev => ({ ...prev, status: editingStatus }));
      }
      
      setEditMode(false);
    } catch (err) {
      toast.error('Failed to update room');
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditingRate(selectedRoom.rate.toString());
    setEditingStatus(selectedRoom.status);
  };

const handleMaintenanceToggle = async () => {
    if (!selectedRoom) return;
    
    try {
      const newStatus = selectedRoom.status === 'maintenance' ? 'available' : 'maintenance';
      await handleStatusChange(selectedRoom.Id, newStatus);
      setSelectedRoom(prev => ({ ...prev, status: newStatus }));
      setEditingStatus(newStatus);
    } catch (err) {
      toast.error('Failed to update maintenance status');
    }
  };

  const handleCleaningToggle = async () => {
    if (!selectedRoom) return;
    
    try {
      const newStatus = selectedRoom.status === 'cleaning' ? 'available' : 'cleaning';
      await handleStatusChange(selectedRoom.Id, newStatus);
      setSelectedRoom(prev => ({ ...prev, status: newStatus }));
      setEditingStatus(newStatus);
    } catch (err) {
      toast.error('Failed to update cleaning status');
    }
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
        <Button variant="primary" icon="Plus" onClick={() => setShowCreateModal(true)}>
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

      {/* Room Details Modal */}
      {showRoomDetails && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Room {selectedRoom.number}</h2>
                <p className="text-gray-600 capitalize">{selectedRoom.type} • Floor {selectedRoom.floor}</p>
              </div>
              <button
                onClick={closeRoomDetails}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status and Rate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Status</span>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedRoom.status === 'available' ? 'bg-green-100 text-green-800' :
                      selectedRoom.status === 'occupied' ? 'bg-red-100 text-red-800' :
                      selectedRoom.status === 'cleaning' ? 'bg-yellow-100 text-yellow-800' :
                      selectedRoom.status === 'maintenance' ? 'bg-gray-100 text-gray-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      <ApperIcon 
                        name={selectedRoom.status === 'available' ? 'Check' :
                              selectedRoom.status === 'occupied' ? 'User' :
                              selectedRoom.status === 'cleaning' ? 'Sparkles' :
                              selectedRoom.status === 'maintenance' ? 'Settings' : 'Clock'} 
                        className="w-3 h-3 mr-1 inline" 
                      />
                      {selectedRoom.status}
                    </div>
                  </div>
                </div>

                <div className="bg-surface p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Rate</span>
                    <div className="flex items-center text-lg font-bold text-secondary">
                      <ApperIcon name="DollarSign" className="w-5 h-5 mr-1" />
                      ${selectedRoom.rate}/night
                    </div>
                  </div>
                </div>
              </div>

              {/* Room Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <ApperIcon name="Building" className="w-5 h-5 mr-3 text-primary" />
                    <span className="font-medium">Floor:</span>
                    <span className="ml-2">{selectedRoom.floor}</span>
                  </div>
                  
                  {selectedRoom.capacity && (
                    <div className="flex items-center text-gray-700">
                      <ApperIcon name="Users" className="w-5 h-5 mr-3 text-primary" />
                      <span className="font-medium">Capacity:</span>
                      <span className="ml-2">{selectedRoom.capacity} guests</span>
                    </div>
                  )}
                  
                  {selectedRoom.beds && (
                    <div className="flex items-center text-gray-700">
                      <ApperIcon name="Bed" className="w-5 h-5 mr-3 text-primary" />
                      <span className="font-medium">Beds:</span>
                      <span className="ml-2">{selectedRoom.beds}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {selectedRoom.size && (
                    <div className="flex items-center text-gray-700">
                      <ApperIcon name="Ruler" className="w-5 h-5 mr-3 text-primary" />
                      <span className="font-medium">Size:</span>
                      <span className="ml-2">{selectedRoom.size} sq ft</span>
                    </div>
                  )}
                  
                  {selectedRoom.view && (
                    <div className="flex items-center text-gray-700">
                      <ApperIcon name="Eye" className="w-5 h-5 mr-3 text-primary" />
                      <span className="font-medium">View:</span>
                      <span className="ml-2">{selectedRoom.view}</span>
                    </div>
                  )}
                  
                  {selectedRoom.lastCleaned && (
                    <div className="flex items-center text-gray-700">
                      <ApperIcon name="Calendar" className="w-5 h-5 mr-3 text-primary" />
                      <span className="font-medium">Last Cleaned:</span>
                      <span className="ml-2">{new Date(selectedRoom.lastCleaned).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              {selectedRoom.features && selectedRoom.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <ApperIcon name="Star" className="w-5 h-5 mr-2 text-secondary" />
                    Features & Amenities
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedRoom.features.map((feature, index) => (
                      <div key={index} className="flex items-center bg-surface px-3 py-2 rounded-md">
                        <ApperIcon name="Check" className="w-4 h-4 mr-2 text-accent" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedRoom.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <ApperIcon name="FileText" className="w-5 h-5 mr-2 text-secondary" />
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{selectedRoom.description}</p>
                </div>
              )}
            </div>

{/* Room Management Section */}
            <div className="border-t border-gray-200 p-6 bg-surface">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="Settings" className="w-5 h-5 mr-2 text-primary" />
                Room Management
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Status Management */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={editingStatus}
                    onChange={(e) => setEditingStatus(e.target.value)}
                    disabled={!editMode}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="reserved">Reserved</option>
                  </select>
                </div>

                {/* Rate Management */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Rate per Night</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={editingRate}
                      onChange={(e) => setEditingRate(e.target.value)}
                      disabled={!editMode}
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3 mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMaintenanceToggle}
                  disabled={editMode}
                  className="flex items-center"
                >
                  <ApperIcon 
                    name={selectedRoom.status === 'maintenance' ? 'CheckCircle' : 'AlertTriangle'} 
                    className="w-4 h-4 mr-2" 
                  />
                  {selectedRoom.status === 'maintenance' ? 'Mark Available' : 'Mark Maintenance'}
                </Button>
                
<Button
                  variant="outline"
                  size="sm"
                  onClick={handleCleaningToggle}
                  disabled={editMode}
                  className="flex items-center"
                >
                  <ApperIcon name="Sparkles" className="w-4 h-4 mr-2" />
                  {selectedRoom.status === 'cleaning' ? 'Cleaning Complete' : 'Schedule Cleaning'}
                </Button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-white">
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={closeRoomDetails}
                  disabled={editMode}
                >
                  Close
                </Button>
              </div>
              
              <div className="flex space-x-3">
                {editMode ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="primary"
                      onClick={handleSaveChanges}
                    >
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="primary"
                    onClick={handleEditRoom}
                  >
                    <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
                    Edit Room
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
</div>
      )}

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Add New Room</h2>
                <p className="text-gray-600">Create a new room in the system</p>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData({
                    number: '',
                    type: 'standard',
                    floor: 1,
                    rate: '',
                    capacity: 1,
                    beds: '',
                    size: '',
                    view: '',
                    features: [],
                    description: ''
                  });
                  setFormErrors({});
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    value={formData.number}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, number: e.target.value }));
                      if (formErrors.number) {
                        setFormErrors(prev => ({ ...prev, number: '' }));
                      }
                    }}
                    className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none ${
                      formErrors.number 
                        ? 'border-error focus:border-error' 
                        : 'border-gray-200 focus:border-primary'
                    }`}
                    placeholder="e.g., 101, 205, etc."
                  />
                  {formErrors.number && (
                    <p className="text-sm text-error">{formErrors.number}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Room Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  >
                    <option value="standard">Standard</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="suite">Suite</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Floor *
                  </label>
                  <input
                    type="number"
                    value={formData.floor}
                    onChange={(e) => setFormData(prev => ({ ...prev, floor: parseInt(e.target.value) || 1 }))}
                    min="1"
                    max="50"
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Rate per Night *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={formData.rate}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, rate: e.target.value }));
                        if (formErrors.rate) {
                          setFormErrors(prev => ({ ...prev, rate: '' }));
                        }
                      }}
                      min="0"
                      step="0.01"
                      className={`w-full pl-8 pr-3 py-2 border-2 rounded-lg focus:outline-none ${
                        formErrors.rate 
                          ? 'border-error focus:border-error' 
                          : 'border-gray-200 focus:border-primary'
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {formErrors.rate && (
                    <p className="text-sm text-error">{formErrors.rate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Capacity (guests)
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 1 }))}
                    min="1"
                    max="10"
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Beds
                  </label>
                  <input
                    type="text"
                    value={formData.beds}
                    onChange={(e) => setFormData(prev => ({ ...prev, beds: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="e.g., 1 King, 2 Queen, etc."
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Size (sq ft)
                  </label>
                  <input
                    type="number"
                    value={formData.size}
                    onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                    min="0"
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="e.g., 350"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    View
                  </label>
                  <input
                    type="text"
                    value={formData.view}
                    onChange={(e) => setFormData(prev => ({ ...prev, view: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="e.g., Ocean, City, Garden"
                  />
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Features & Amenities
                </label>
                <input
                  type="text"
                  value={formData.features.join(', ')}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    features: e.target.value.split(',').map(f => f.trim()).filter(f => f) 
                  }))}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  placeholder="e.g., WiFi, Air Conditioning, Mini Bar (separate with commas)"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none resize-none"
                  placeholder="Optional room description..."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end items-center p-6 border-t border-gray-200 bg-white space-x-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData({
                    number: '',
                    type: 'standard',
                    floor: 1,
                    rate: '',
                    capacity: 1,
                    beds: '',
                    size: '',
                    view: '',
                    features: [],
                    description: ''
                  });
                  setFormErrors({});
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="primary"
                onClick={async () => {
                  // Validate form
                  const errors = {};
                  if (!formData.number.trim()) {
                    errors.number = 'Room number is required';
                  }
                  if (!formData.rate || parseFloat(formData.rate) <= 0) {
                    errors.rate = 'Valid rate is required';
                  }
                  
                  // Check for duplicate room number
                  if (formData.number.trim() && rooms.some(room => room.number === formData.number.trim())) {
                    errors.number = 'Room number already exists';
                  }

                  if (Object.keys(errors).length > 0) {
                    setFormErrors(errors);
                    return;
                  }

                  try {
                    const newRoomData = {
                      number: formData.number.trim(),
                      type: formData.type,
                      floor: formData.floor,
                      rate: parseFloat(formData.rate),
                      capacity: formData.capacity,
                      beds: formData.beds || null,
                      size: formData.size ? parseInt(formData.size) : null,
                      view: formData.view || null,
                      features: formData.features.length > 0 ? formData.features : null,
                      description: formData.description || null,
                      status: 'available',
                      lastCleaned: new Date().toISOString().split('T')[0]
                    };

                    const createdRoom = await roomService.create(newRoomData);
                    setRooms(prev => [...prev, createdRoom]);
                    setShowCreateModal(false);
                    setFormData({
                      number: '',
                      type: 'standard',
                      floor: 1,
                      rate: '',
                      capacity: 1,
                      beds: '',
                      size: '',
                      view: '',
                      features: [],
                      description: ''
                    });
                    setFormErrors({});
                    toast.success(`Room ${createdRoom.number} created successfully`);
                  } catch (err) {
                    toast.error('Failed to create room. Please try again.');
                  }
                }}
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Create Room
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Rooms;