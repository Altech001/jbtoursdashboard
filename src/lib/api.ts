import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jbheartfelt-api.onrender.com',
  headers: {
    'accept': 'application/json'
  }
});

// API functions
export const getGallery = () => api.get('/photos/gallery');
export const getTrips = () => api.get('/books/trips/');
export const getBookings = () => api.get('/bookform/');
export const getVideos = () => api.get('/videos/list');
export const getPlaces = () => api.get('/places/');