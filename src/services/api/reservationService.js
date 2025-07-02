import reservationsData from '@/services/mockData/reservations.json';

let reservations = [...reservationsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const reservationService = {
  async getAll() {
    await delay(300);
    return [...reservations];
  },

  async getById(Id) {
    await delay(200);
    const reservation = reservations.find(r => r.Id === parseInt(Id));
    if (!reservation) {
      throw new Error('Reservation not found');
    }
    return { ...reservation };
  },

  async create(reservationData) {
    await delay(400);
    const maxId = Math.max(...reservations.map(r => r.Id), 0);
    const newReservation = {
      ...reservationData,
      Id: maxId + 1
    };
    reservations.push(newReservation);
    return { ...newReservation };
  },

  async update(Id, reservationData) {
    await delay(300);
    const index = reservations.findIndex(r => r.Id === parseInt(Id));
    if (index === -1) {
      throw new Error('Reservation not found');
    }
    reservations[index] = { ...reservations[index], ...reservationData };
    return { ...reservations[index] };
  },

  async delete(Id) {
    await delay(250);
    const index = reservations.findIndex(r => r.Id === parseInt(Id));
    if (index === -1) {
      throw new Error('Reservation not found');
    }
    const deleted = reservations.splice(index, 1)[0];
    return { ...deleted };
  },

  async getByGuest(guestId) {
    await delay(250);
    return reservations.filter(reservation => 
      reservation.guestId === guestId.toString()
    ).map(reservation => ({ ...reservation }));
  },

  async getByStatus(status) {
    await delay(250);
    return reservations.filter(reservation => 
      reservation.status === status
    ).map(reservation => ({ ...reservation }));
  },

  async getByDateRange(startDate, endDate) {
    await delay(250);
    return reservations.filter(reservation => {
      const checkIn = new Date(reservation.checkIn);
      const checkOut = new Date(reservation.checkOut);
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      return (checkIn >= start && checkIn <= end) || 
             (checkOut >= start && checkOut <= end) ||
             (checkIn <= start && checkOut >= end);
    }).map(reservation => ({ ...reservation }));
  }
};