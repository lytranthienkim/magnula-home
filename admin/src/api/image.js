import apiClient from './config';

export const getAllImages = async () => {
    const res = await apiClient.get('/products/images');
    return res.data;
};

export const getImageById = async (imageId) => {
    const res = await apiClient.get(`/products/images/${imageId}`);
    return res.data;
};

export const updateImage = async (imageId, imageData) => {
    const res = await apiClient.put(`/products/images/${imageId}`, imageData);
    return res.data;
};

export const restoreImage = async (imageId) => {
    const res = await apiClient.post(`/products/images/${imageId}/restore`);
    return res.data;
};