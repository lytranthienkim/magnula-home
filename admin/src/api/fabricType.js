import apiClient from './config';

export const getAllFabricTypes = async () => {
    const res = await apiClient.get('/products/fabric-types');
    return res.data;
};

export const createFabricType = async (fabricTypeData) => {
    const res = await apiClient.post('/products/fabric-types', fabricTypeData);
    return res.data;
};

export const updateFabricType = async (fabricTypeId, fabricTypeData) => {
    const res = await apiClient.put(`/products/fabric-types/${fabricTypeId}`, fabricTypeData);
    return res.data;
};

export const updateFabricTypeStatus = async (fabricTypeId, status) => {
    const res = await apiClient.patch(`/products/fabric-types/${fabricTypeId}/status`, { status });
    return res.data;
};

export const deleteFabricType = async (fabricTypeId) => {
    const res = await apiClient.delete(`/products/fabric-types/${fabricTypeId}`);
    return res.data;
};

export const restoreFabricType = async (fabricTypeId) => {
    const res = await apiClient.post(`/products/fabric-types/${fabricTypeId}/restore`);
    return res.data;
};
