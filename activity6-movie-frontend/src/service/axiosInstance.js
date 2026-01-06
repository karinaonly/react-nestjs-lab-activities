import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - only redirect if not on login page
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
