import apiClient from './config';

export const getAllCollections = async (limit, offset) => {
    const params = {};
    if (limit !== undefined) params.limit = limit;
    if (offset !== undefined) params.offset = offset;
    const res = await apiClient.get('/products/collections', { params });
    return res.data;
};

export const getCollectionById = async (collectionId) => {
    const res = await apiClient.get(`/products/collections/${collectionId}`);
    return res.data;
};

export const createCollection = async (collectionData) => {
    const res = await apiClient.post('/products/collections', collectionData);
    return res.data;
};

export const updateCollection = async (collectionId, collectionData) => {
    const res = await apiClient.put(`/products/collections/${collectionId}`, collectionData);
    return res.data;
};

export const updateCollectionStatus = async (collectionId, status) => {
    const res = await apiClient.patch(`/products/collections/${collectionId}/status`, { status });
    return res.data;
};

export const deleteCollection = async (collectionId) => {
    const res = await apiClient.delete(`/products/collections/${collectionId}`);
    return res.data;
};

export const restoreCollection = async (collectionId) => {
    const res = await apiClient.post(`/products/collections/${collectionId}/restore`);
    return res.data;
};