import apiClient from './config';

export const getProductImages = async (productId) => {
    const res = await apiClient.get(`/products/${productId}/images`);
    return res.data;
};

export const addProductImage = async (productId, imageData) => {
    const res = await apiClient.post(`/products/${productId}/images`, imageData);
    return res.data;
};

export const updateProductImage = async (imageId, imageData) => {
    const res = await apiClient.put(`/products/images/${imageId}`, imageData);
    return res.data;
};

export const deleteProductImage = async (imageId) => {
    const res = await apiClient.delete(`/products/images/${imageId}`);
    return res.data;
};