import guestsData from '@/services/mockData/guests.json';

let guests = [...guestsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const guestService = {
  async getAll() {
    await delay(300);
    return [...guests];
  },

  async getById(Id) {
    await delay(200);
    const guest = guests.find(g => g.Id === parseInt(Id));
    if (!guest) {
      throw new Error('Guest not found');
    }
    return { ...guest };
  },

  async create(guestData) {
    await delay(400);
    const maxId = Math.max(...guests.map(g => g.Id), 0);
    const newGuest = {
      ...guestData,
      Id: maxId + 1,
      bookingHistory: []
    };
    guests.push(newGuest);
    return { ...newGuest };
  },

  async update(Id, guestData) {
    await delay(300);
    const index = guests.findIndex(g => g.Id === parseInt(Id));
    if (index === -1) {
      throw new Error('Guest not found');
    }
    guests[index] = { ...guests[index], ...guestData };
    return { ...guests[index] };
  },

  async delete(Id) {
    await delay(250);
    const index = guests.findIndex(g => g.Id === parseInt(Id));
    if (index === -1) {
      throw new Error('Guest not found');
    }
    const deleted = guests.splice(index, 1)[0];
    return { ...deleted };
  },

  async search(query) {
    await delay(250);
    const searchTerm = query.toLowerCase();
    return guests.filter(guest => 
      guest.name.toLowerCase().includes(searchTerm) ||
      guest.email.toLowerCase().includes(searchTerm) ||
      guest.phone.includes(searchTerm)
    ).map(guest => ({ ...guest }));
  }
};