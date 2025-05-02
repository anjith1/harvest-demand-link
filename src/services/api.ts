import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const auth = {
  register: async (data: { name: string; email: string; password: string; role: string }) =>
    api.post('/auth/register', data),
  login: async (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// Locations API
export const locations = {
  create: async (data: { position: [number, number]; name: string; necessities: any[] }) =>
    api.post('/locations', data),
  getAll: async () => api.get('/locations'),
  getNearby: async (lat: number, lng: number, radius: number) =>
    api.get(`/locations/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
  updateStatus: async (id: string, status: string) =>
    api.patch(`/locations/${id}`, { status }),
  delete: async (id: string) => api.delete(`/locations/${id}`),
};

export default api;
