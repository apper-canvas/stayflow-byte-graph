const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const roomService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "beds" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "number" } },
          { field: { Name: "type" } },
          { field: { Name: "floor" } },
          { field: { Name: "status" } },
          { field: { Name: "rate" } },
          { field: { Name: "features" } },
          { field: { Name: "capacity" } },
          { field: { Name: "size" } },
          { field: { Name: "view" } },
          { field: { Name: "last_cleaned" } },
          { field: { Name: "description" } }
        ]
      };

      const response = await apperClient.fetchRecords('room', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching rooms:", error?.response?.data?.message);
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
          { field: { Name: "beds" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "number" } },
          { field: { Name: "type" } },
          { field: { Name: "floor" } },
          { field: { Name: "status" } },
          { field: { Name: "rate" } },
          { field: { Name: "features" } },
          { field: { Name: "capacity" } },
          { field: { Name: "size" } },
          { field: { Name: "view" } },
          { field: { Name: "last_cleaned" } },
          { field: { Name: "description" } }
        ]
      };

      const response = await apperClient.getRecordById('room', parseInt(Id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching room with ID ${Id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(roomData) {
    try {
      const updateableData = {
        beds: roomData.beds || "",
        Name: roomData.Name || roomData.name || "",
        Tags: roomData.Tags || "",
        Owner: roomData.Owner || null,
        number: roomData.number || "",
        type: roomData.type || "standard",
        floor: parseInt(roomData.floor) || 1,
        status: roomData.status || "available",
        rate: parseFloat(roomData.rate) || 0,
        features: Array.isArray(roomData.features) ? roomData.features.join(',') : roomData.features || "",
        capacity: parseInt(roomData.capacity) || 1,
        size: parseInt(roomData.size) || null,
        view: roomData.view || "",
        last_cleaned: roomData.last_cleaned || new Date().toISOString().split('T')[0],
        description: roomData.description || ""
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('room', params);
      
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
        console.error("Error creating room:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(Id, roomData) {
    try {
      const updateableData = {
        Id: parseInt(Id)
      };

      // Only include updateable fields that are provided
      if (roomData.beds !== undefined) updateableData.beds = roomData.beds;
      if (roomData.Name !== undefined) updateableData.Name = roomData.Name;
      if (roomData.name !== undefined) updateableData.Name = roomData.name;
      if (roomData.Tags !== undefined) updateableData.Tags = roomData.Tags;
      if (roomData.Owner !== undefined) updateableData.Owner = roomData.Owner;
      if (roomData.number !== undefined) updateableData.number = roomData.number;
      if (roomData.type !== undefined) updateableData.type = roomData.type;
      if (roomData.floor !== undefined) updateableData.floor = parseInt(roomData.floor);
      if (roomData.status !== undefined) updateableData.status = roomData.status;
      if (roomData.rate !== undefined) updateableData.rate = parseFloat(roomData.rate);
      if (roomData.features !== undefined) {
        updateableData.features = Array.isArray(roomData.features) ? roomData.features.join(',') : roomData.features;
      }
      if (roomData.capacity !== undefined) updateableData.capacity = parseInt(roomData.capacity);
      if (roomData.size !== undefined) updateableData.size = parseInt(roomData.size);
      if (roomData.view !== undefined) updateableData.view = roomData.view;
      if (roomData.last_cleaned !== undefined) updateableData.last_cleaned = roomData.last_cleaned;
      if (roomData.description !== undefined) updateableData.description = roomData.description;

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('room', params);
      
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
        console.error("Error updating room:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord('room', params);
      
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
        console.error("Error deleting room:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async updateStatus(Id, status) {
    return this.update(Id, { status });
  },

  async getByStatus(status) {
    try {
      const params = {
        fields: [
          { field: { Name: "beds" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "number" } },
          { field: { Name: "type" } },
          { field: { Name: "floor" } },
          { field: { Name: "status" } },
          { field: { Name: "rate" } },
          { field: { Name: "features" } },
          { field: { Name: "capacity" } },
          { field: { Name: "size" } },
          { field: { Name: "view" } },
          { field: { Name: "last_cleaned" } },
          { field: { Name: "description" } }
        ],
        where: [
          {
            FieldName: "status",
            Operator: "EqualTo",
            Values: [status]
          }
        ]
      };

      const response = await apperClient.fetchRecords('room', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching rooms by status:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getByFloor(floor) {
    try {
      const params = {
        fields: [
          { field: { Name: "beds" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "number" } },
          { field: { Name: "type" } },
          { field: { Name: "floor" } },
          { field: { Name: "status" } },
          { field: { Name: "rate" } },
          { field: { Name: "features" } },
          { field: { Name: "capacity" } },
          { field: { Name: "size" } },
          { field: { Name: "view" } },
          { field: { Name: "last_cleaned" } },
          { field: { Name: "description" } }
        ],
        where: [
          {
            FieldName: "floor",
            Operator: "EqualTo",
            Values: [parseInt(floor)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('room', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching rooms by floor:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
};