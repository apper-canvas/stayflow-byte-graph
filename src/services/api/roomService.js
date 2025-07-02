import roomsData from '@/services/mockData/rooms.json';

let rooms = [...roomsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const roomService = {
  async getAll() {
    await delay(300);
    return [...rooms];
  },

  async getById(Id) {
    await delay(200);
    const room = rooms.find(r => r.Id === parseInt(Id));
    if (!room) {
      throw new Error('Room not found');
    }
    return { ...room };
  },

  async create(roomData) {
    await delay(400);
    const maxId = Math.max(...rooms.map(r => r.Id), 0);
    const newRoom = {
      ...roomData,
      Id: maxId + 1
    };
    rooms.push(newRoom);
    return { ...newRoom };
  },

  async update(Id, roomData) {
    await delay(300);
    const index = rooms.findIndex(r => r.Id === parseInt(Id));
    if (index === -1) {
      throw new Error('Room not found');
    }
    rooms[index] = { ...rooms[index], ...roomData };
    return { ...rooms[index] };
  },

  async delete(Id) {
    await delay(250);
    const index = rooms.findIndex(r => r.Id === parseInt(Id));
    if (index === -1) {
      throw new Error('Room not found');
    }
    const deleted = rooms.splice(index, 1)[0];
    return { ...deleted };
  },

  async updateStatus(Id, status) {
    await delay(200);
    const index = rooms.findIndex(r => r.Id === parseInt(Id));
    if (index === -1) {
      throw new Error('Room not found');
    }
    rooms[index].status = status;
    return { ...rooms[index] };
  },

  async getByStatus(status) {
    await delay(250);
    return rooms.filter(room => room.status === status).map(room => ({ ...room }));
  },

  async getByFloor(floor) {
    await delay(250);
    return rooms.filter(room => room.floor === parseInt(floor)).map(room => ({ ...room }));
  }
};