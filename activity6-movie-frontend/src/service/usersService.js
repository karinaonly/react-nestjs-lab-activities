import axiosInstance from './axiosInstance';

// Get all users (Admin only)
export const getAllUsers = async () => {
  const response = await axiosInstance.get('/users');
  return response.data;
};

// Get user statistics (Admin only)
export const getUserStats = async () => {
  const response = await axiosInstance.get('/users/stats');
  return response.data;
};

// Get current user profile
export const getUserProfile = async () => {
  const response = await axiosInstance.get('/users/profile');
  return response.data;
};

// Get user by ID
export const getUserById = async (id) => {
  const response = await axiosInstance.get(`/users/${id}`);
  return response.data;
};

// Create new user (Admin only)
export const createUser = async (userData) => {
  const response = await axiosInstance.post('/users', userData);
  return response.data;
};

// Update user
export const updateUser = async (id, userData) => {
  const response = await axiosInstance.patch(`/users/${id}`, userData);
  return response.data;
};

// Delete user (Admin only)
export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/users/${id}`);
  return response.data;
};
