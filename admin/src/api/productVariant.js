import apiClient from './config';

export const getProductVariants = async (productId) => {
    const res = await apiClient.get(`/products/${productId}/variants`);
    return res.data;
};

export const createProductVariant = async (productId, variantData) => {
    const res = await apiClient.post(`/variants`, { ...variantData, productId });
    return res.data;
};

export const updateProductVariant = async (variantId, variantData) => {
    const res = await apiClient.put(`/products/variants/${variantId}`, variantData);
    return res.data;
};