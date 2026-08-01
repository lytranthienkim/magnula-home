import apiClient from './config';

export const getAllRoles = async (showDeleted = false) => {
  const res = await apiClient.get(`/roles${showDeleted ? '?deleted=true' : ''}`);
  return res.data;
};

export const getRoleById = async (roleId) => {
  const res = await apiClient.get(`/roles/${roleId}`);
  return res.data;
};

export const createRole = async (roleName) => {
  const res = await apiClient.post('/roles', { roleName });
  return res.data;
};

export const updateRole = async (roleId, roleName) => {
  const res = await apiClient.put(`/roles/${roleId}`, { roleName });
  return res.data;
};

export const deleteRole = async (roleId) => {
  const res = await apiClient.delete(`/roles/${roleId}`);
  return res.data;
};

export const restoreRole = async (roleId) => {
  const res = await apiClient.post(`/roles/${roleId}/restore`);
  return res.data;
};

export const getRolePermissions = async (roleId) => {
  const res = await apiClient.get(`/roles/${roleId}/permissions`);
  return res.data;
};

export const assignPermissionToRole = async (roleId, permissionId) => {
  const res = await apiClient.post(`/roles/${roleId}/assign-permission`, {
    permissionId,
  });
  return res.data;
};

export const removePermissionFromRole = async (roleId, permissionId) => {
  const res = await apiClient.delete(`/roles/${roleId}/permissions/${permissionId}`);
  return res.data;
};