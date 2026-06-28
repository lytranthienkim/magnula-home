import apiClient from './config';

// Get all roles
export const getAllRoles = async () => {
  const res = await apiClient.get('/roles');
  return res.data;
};

// Get role by ID
export const getRoleById = async (roleId) => {
  const res = await apiClient.get(`/roles/${roleId}`);
  return res.data;
};

// Create role (Admin only)
export const createRole = async (roleName) => {
  const res = await apiClient.post('/roles', { roleName });
  return res.data;
};

// Update role (Admin only)
export const updateRole = async (roleId, roleName) => {
  const res = await apiClient.put(`/roles/${roleId}`, { roleName });
  return res.data;
};

// Delete role (soft delete)
export const deleteRole = async (roleId) => {
  const res = await apiClient.delete(`/roles/${roleId}`);
  return res.data;
};

// Restore role
export const restoreRole = async (roleId) => {
  const res = await apiClient.post(`/roles/${roleId}/restore`);
  return res.data;
};

// Get all permissions
export const getAllPermissions = async () => {
  const res = await apiClient.get('/permissions');
  return res.data;
};

// Get permission by ID
export const getPermissionById = async (permissionId) => {
  const res = await apiClient.get(`/permissions/${permissionId}`);
  return res.data;
};

// Create permission (Admin only)
export const createPermission = async (permissionKey, description) => {
  const res = await apiClient.post('/permissions', {
    permissionKey,
    description,
  });
  return res.data;
};

// Update permission (Admin only)
export const updatePermission = async (permissionId, permissionKey, description) => {
  const res = await apiClient.put(`/permissions/${permissionId}`, {
    permissionKey,
    description,
  });
  return res.data;
};

// Delete permission (soft delete)
export const deletePermission = async (permissionId) => {
  const res = await apiClient.delete(`/permissions/${permissionId}`);
  return res.data;
};

// Restore permission
export const restorePermission = async (permissionId) => {
  const res = await apiClient.post(`/permissions/${permissionId}/restore`);
  return res.data;
};

// Get role permissions
export const getRolePermissions = async (roleId) => {
  const res = await apiClient.get(`/roles/${roleId}/permissions`);
  return res.data;
};

// Assign permission to role (Admin only)
export const assignPermissionToRole = async (roleId, permissionId) => {
  const res = await apiClient.post(`/roles/${roleId}/assign-permission`, {
    permissionId,
  });
  return res.data;
};

// Remove permission from role (Admin only)
export const removePermissionFromRole = async (roleId, permissionId) => {
  const res = await apiClient.delete(`/roles/${roleId}/permissions/${permissionId}`);
  return res.data;
};
