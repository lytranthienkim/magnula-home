import apiClient from './config';

export const getAllProductRequests = async (limit, offset) => {
    const params = {};
    if (limit !== undefined) params.limit = limit;
    if (offset !== undefined) params.offset = offset;
    const res = await apiClient.get('/product-requests', { params });
    return res.data;
};

export const getProductRequestById = async (requestId) => {
    const res = await apiClient.get(`/product-requests/${requestId}`);
    return res.data;
};

export const updateProductRequest = async (requestId, requestData) => {
    const res = await apiClient.put(`/product-requests/${requestId}`, requestData);
    return res.data;
};

export const deleteProductRequest = async (requestId) => {
    const res = await apiClient.delete(`/product-requests/${requestId}`);
    return res.data;
};

export const restoreProductRequest = async (requestId) => {
    const res = await apiClient.post(`/product-requests/${requestId}/restore`);
    return res.data;
};