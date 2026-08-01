import apiClient from './config';

export const getAllPermissions = async (limit = 10000, offset = 0) => {
  const res = await apiClient.get(`/permissions?limit=${limit}&offset=${offset}`);
  return res.data;
};

export const getPermissionById = async (permissionId) => {
  const res = await apiClient.get(`/permissions/${permissionId}`);
  return res.data;
};
