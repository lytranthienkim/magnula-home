import apiClient from './config';

export const getAllCollectionImages = async (limit, offset) => {
    const params = {};
    if (limit !== undefined) params.limit = limit;
    if (offset !== undefined) params.offset = offset;
    const res = await apiClient.get('/products/collection-images', { params });
    return res.data;
};

export const getCollectionImages = async (collectionId) => {
    const res = await apiClient.get(`/products/collections/${collectionId}/images`);
    return res.data;
};

export const addCollectionImage = async (collectionId, imageData) => {
    const res = await apiClient.post(`/products/collection-images`, { ...imageData, collectionId });
    return res.data;
};

export const updateCollectionImage = async (imageId, imageData) => {
    const res = await apiClient.put(`/products/collection-images/${imageId}`, imageData);
    return res.data;
};

export const deleteCollectionImage = async (imageId) => {
    const res = await apiClient.delete(`/products/collection-images/${imageId}`);
    return res.data;
};