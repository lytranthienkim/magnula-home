import apiClient from './config';

// Get all users
export const getAllUsers = async () => {
  const res = await apiClient.get('/users');
  return res.data;
};

// Create new user (Admin only)
export const createUser = async (userData) => {
  const res = await apiClient.post('/users', userData);
  return res.data;
};

// Update user profile
export const updateUserProfile = async (userId, userData) => {
  const res = await apiClient.put(`/users/${userId}`, userData);
  return res.data;
};

// Reset user password (Admin only)
export const resetUserPassword = async (userId, newPassword) => {
  const res = await apiClient.post(`/users/${userId}/reset-password`, {
    newPassword,
  });
  return res.data;
};

// Update user status (activate/deactivate)
export const updateUserStatus = async (userId, isActive) => {
  const res = await apiClient.patch(`/users/${userId}/status`, {
    isActive,
  });
  return res.data;
};

// Assign role to user (Admin only)
export const assignRoleToUser = async (userId, roleId) => {
  const res = await apiClient.post(`/users/${userId}/assign-role`, {
    roleId,
  });
  return res.data;
};

// Remove role from user (Admin only)
export const removeRoleFromUser = async (userId, roleId) => {
  const res = await apiClient.delete(`/users/${userId}/roles/${roleId}`);
  return res.data;
};

// Get user roles
export const getUserRoles = async (userId) => {
  const res = await apiClient.get(`/users/${userId}/roles`);
  return res.data;
};
