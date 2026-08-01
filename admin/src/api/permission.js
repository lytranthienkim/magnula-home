import apiClient from './config';

export const getAllPermissions = async () => {
    const res = await apiClient.get('/permissions');
    return res.data;
};

export const getPermissionById = async (permissionId) => {
    const res = await apiClient.get(`/permissions/${permissionId}`);
    return res.data;
};

export const createPermission = async (permissionKey, description) => {
    const res = await apiClient.post('/permissions', {
        permissionKey,
        description,
    });
    return res.data;
};

export const updatePermission = async (permissionId, permissionKey, description) => {
    const res = await apiClient.put(`/permissions/${permissionId}`, {
        permissionKey,
        description,
    });
    return res.data;
};

export const deletePermission = async (permissionId) => {
    const res = await apiClient.delete(`/permissions/${permissionId}`);
    return res.data;
};

export const restorePermission = async (permissionId) => {
    const res = await apiClient.post(`/permissions/${permissionId}/restore`);
    return res.data;
};
