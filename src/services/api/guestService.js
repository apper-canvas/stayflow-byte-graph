const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const guestService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "address" } },
          { field: { Name: "id_number" } },
          { field: { Name: "preferred_room" } },
          { field: { Name: "loyalty_points" } },
          { field: { Name: "special_requests" } },
          { field: { Name: "notes" } }
        ]
      };

      const response = await apperClient.fetchRecords('guest', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching guests:", error?.response?.data?.message);
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
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "address" } },
          { field: { Name: "id_number" } },
          { field: { Name: "preferred_room" } },
          { field: { Name: "loyalty_points" } },
          { field: { Name: "special_requests" } },
          { field: { Name: "notes" } }
        ]
      };

      const response = await apperClient.getRecordById('guest', parseInt(Id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching guest with ID ${Id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(guestData) {
    try {
      const updateableData = {
        Name: guestData.Name || guestData.name || "",
        Tags: guestData.Tags || "",
        Owner: guestData.Owner || null,
        email: guestData.email || "",
        phone: guestData.phone || "",
        address: guestData.address || "",
        id_number: guestData.id_number || guestData.idNumber || "",
        preferred_room: guestData.preferred_room || guestData.preferredRoom || "",
        loyalty_points: parseInt(guestData.loyalty_points || guestData.loyaltyPoints) || 0,
        special_requests: guestData.special_requests || guestData.specialRequests || "",
        notes: guestData.notes || ""
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('guest', params);
      
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
        console.error("Error creating guest:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(Id, guestData) {
    try {
      const updateableData = {
        Id: parseInt(Id)
      };

      // Only include updateable fields that are provided
      if (guestData.Name !== undefined) updateableData.Name = guestData.Name;
      if (guestData.name !== undefined) updateableData.Name = guestData.name;
      if (guestData.Tags !== undefined) updateableData.Tags = guestData.Tags;
      if (guestData.Owner !== undefined) updateableData.Owner = guestData.Owner;
      if (guestData.email !== undefined) updateableData.email = guestData.email;
      if (guestData.phone !== undefined) updateableData.phone = guestData.phone;
      if (guestData.address !== undefined) updateableData.address = guestData.address;
      if (guestData.id_number !== undefined) updateableData.id_number = guestData.id_number;
      if (guestData.idNumber !== undefined) updateableData.id_number = guestData.idNumber;
      if (guestData.preferred_room !== undefined) updateableData.preferred_room = guestData.preferred_room;
      if (guestData.preferredRoom !== undefined) updateableData.preferred_room = guestData.preferredRoom;
      if (guestData.loyalty_points !== undefined) updateableData.loyalty_points = parseInt(guestData.loyalty_points);
      if (guestData.loyaltyPoints !== undefined) updateableData.loyalty_points = parseInt(guestData.loyaltyPoints);
      if (guestData.special_requests !== undefined) updateableData.special_requests = guestData.special_requests;
      if (guestData.specialRequests !== undefined) updateableData.special_requests = guestData.specialRequests;
      if (guestData.notes !== undefined) updateableData.notes = guestData.notes;

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('guest', params);
      
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
        console.error("Error updating guest:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord('guest', params);
      
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
        console.error("Error deleting guest:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async search(query) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "address" } },
          { field: { Name: "id_number" } },
          { field: { Name: "preferred_room" } },
          { field: { Name: "loyalty_points" } },
          { field: { Name: "special_requests" } },
          { field: { Name: "notes" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "Name",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "email", 
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "phone",
                    operator: "Contains", 
                    values: [query]
                  }
                ]
              }
            ]
          }
        ]
      };

      const response = await apperClient.fetchRecords('guest', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching guests:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
};