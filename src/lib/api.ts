import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jbheartfelt-api.onrender.com',
  headers: {
    'accept': 'application/json'
  }
});

// API functions
export const getGallery = () => api.get('/photos/gallery');
// export const getTrips = () => api.get('/books/trips/');
// export const getBookings = () => api.get('/bookform/');
export const getVideos = () => api.get('/videos/list');
export const getPlaces = () => api.get('/places/');

// bookforms
export const getBookings = () => api.get('/bookform/');
export const updateBooking = (booking: any) => api.put(`/bookform/${booking.id}`, booking);
export const deleteBooking = (bookingId: string) => api.delete(`/bookform/${bookingId}`);

// Trips
export const getTrips = () => api.get('/books/trips/');
export const deleteTrip = (tripId: string) => api.delete(`/books/trips/${tripId}`);
export const updateTripStatus = ({ tripId, status }: { tripId: string, status: string }) => 
  api.put(`/books/trips/${tripId}/status?status=${status}`);
export const addTrip = (tripData: any) => api.post('/books/trips/', tripData, {
  headers: {
    'Content-Type': 'application/json',
  }
});