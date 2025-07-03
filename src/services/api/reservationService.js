const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const reservationService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "guest_id" } },
          { field: { Name: "check_in" } },
          { field: { Name: "check_out" } },
          { field: { Name: "total_amount" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } },
          { field: { Name: "created_at" } },
          { field: { Name: "room_id" } }
        ]
      };

      const response = await apperClient.fetchRecords('reservation', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching reservations:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(Id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "guest_id" } },
          { field: { Name: "check_in" } },
          { field: { Name: "check_out" } },
          { field: { Name: "total_amount" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } },
          { field: { Name: "created_at" } },
          { field: { Name: "room_id" } }
        ]
      };

      const response = await apperClient.getRecordById('reservation', parseInt(Id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching reservation with ID ${Id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(reservationData) {
    try {
      const updateableData = {
        Name: reservationData.Name || reservationData.name || "",
        Tags: reservationData.Tags || "",
        Owner: reservationData.Owner || null,
        guest_id: parseInt(reservationData.guest_id || reservationData.guestId) || null,
        check_in: reservationData.check_in || reservationData.checkIn || "",
        check_out: reservationData.check_out || reservationData.checkOut || "",
        total_amount: parseFloat(reservationData.total_amount || reservationData.totalAmount) || 0,
        status: reservationData.status || "confirmed",
        notes: reservationData.notes || "",
        created_at: reservationData.created_at || reservationData.createdAt || new Date().toISOString(),
        room_id: parseInt(reservationData.room_id || reservationData.roomId) || null
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('reservation', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating reservation:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(Id, reservationData) {
    try {
      const updateableData = {
        Id: parseInt(Id)
      };

      // Only include updateable fields that are provided
      if (reservationData.Name !== undefined) updateableData.Name = reservationData.Name;
      if (reservationData.name !== undefined) updateableData.Name = reservationData.name;
      if (reservationData.Tags !== undefined) updateableData.Tags = reservationData.Tags;
      if (reservationData.Owner !== undefined) updateableData.Owner = reservationData.Owner;
      if (reservationData.guest_id !== undefined) updateableData.guest_id = parseInt(reservationData.guest_id);
      if (reservationData.guestId !== undefined) updateableData.guest_id = parseInt(reservationData.guestId);
      if (reservationData.check_in !== undefined) updateableData.check_in = reservationData.check_in;
      if (reservationData.checkIn !== undefined) updateableData.check_in = reservationData.checkIn;
      if (reservationData.check_out !== undefined) updateableData.check_out = reservationData.check_out;
      if (reservationData.checkOut !== undefined) updateableData.check_out = reservationData.checkOut;
      if (reservationData.total_amount !== undefined) updateableData.total_amount = parseFloat(reservationData.total_amount);
      if (reservationData.totalAmount !== undefined) updateableData.total_amount = parseFloat(reservationData.totalAmount);
      if (reservationData.status !== undefined) updateableData.status = reservationData.status;
      if (reservationData.notes !== undefined) updateableData.notes = reservationData.notes;
      if (reservationData.created_at !== undefined) updateableData.created_at = reservationData.created_at;
      if (reservationData.createdAt !== undefined) updateableData.created_at = reservationData.createdAt;
      if (reservationData.room_id !== undefined) updateableData.room_id = parseInt(reservationData.room_id);
      if (reservationData.roomId !== undefined) updateableData.room_id = parseInt(reservationData.roomId);

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('reservation', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating reservation:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async delete(Id) {
    try {
      const params = {
        RecordIds: [parseInt(Id)]
      };

      const response = await apperClient.deleteRecord('reservation', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting reservation:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async getByGuest(guestId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "guest_id" } },
          { field: { Name: "check_in" } },
          { field: { Name: "check_out" } },
          { field: { Name: "total_amount" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } },
          { field: { Name: "created_at" } },
          { field: { Name: "room_id" } }
        ],
        where: [
          {
            FieldName: "guest_id",
            Operator: "EqualTo",
            Values: [parseInt(guestId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('reservation', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching reservations by guest:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getByStatus(status) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "guest_id" } },
          { field: { Name: "check_in" } },
          { field: { Name: "check_out" } },
          { field: { Name: "total_amount" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } },
          { field: { Name: "created_at" } },
          { field: { Name: "room_id" } }
        ],
        where: [
          {
            FieldName: "status",
            Operator: "EqualTo",
            Values: [status]
          }
        ]
      };

      const response = await apperClient.fetchRecords('reservation', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching reservations by status:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getByDateRange(startDate, endDate) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "guest_id" } },
          { field: { Name: "check_in" } },
          { field: { Name: "check_out" } },
          { field: { Name: "total_amount" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } },
          { field: { Name: "created_at" } },
          { field: { Name: "room_id" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "check_in",
                    operator: "GreaterThanOrEqualTo",
                    values: [startDate]
                  },
                  {
                    fieldName: "check_in",
                    operator: "LessThanOrEqualTo",
                    values: [endDate]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "check_out",
                    operator: "GreaterThanOrEqualTo",
                    values: [startDate]
                  },
                  {
                    fieldName: "check_out",
                    operator: "LessThanOrEqualTo",
                    values: [endDate]
                  }
                ]
              }
            ]
          }
        ]
      };

      const response = await apperClient.fetchRecords('reservation', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching reservations by date range:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
};