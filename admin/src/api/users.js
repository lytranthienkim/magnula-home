import apiClient from './config';

export const getAllUsers = async () => {
  const res = await apiClient.get('/users');
  return res.data;
};

export const createUser = async (userData) => {
  const res = await apiClient.post('/users', userData);
  return res.data;
};

export const updateUserProfile = async (userId, userData) => {
  const res = await apiClient.put(`/profile/${userId}`, userData);
  return res.data;
};

export const resetUserPassword = async (userId, newPassword) => {
  const res = await apiClient.post(`/users/${userId}/reset-password`, {
    newPassword,
  });
  return res.data;
};

export const updateUserStatus = async (userId, isActive) => {
  const res = await apiClient.patch(`/users/${userId}/status`, {
    isActive,
  });
  return res.data;
};

export const assignRoleToUser = async (userId, roleId) => {
  const res = await apiClient.post(`/users/${userId}/assign-role`, {
    roleId,
  });
  return res.data;
};

export const removeRoleFromUser = async (userId, roleId) => {
  const res = await apiClient.delete(`/users/${userId}/roles/${roleId}`);
  return res.data;
};

export const getUserRoles = async (userId) => {
  const res = await apiClient.get(`/users/${userId}/roles`);
  return res.data;
};