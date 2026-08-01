import apiClient from './config';

export const getAllPaymentMethods = async () => {
    const res = await apiClient.get('/payment-methods', { params: { includeInactive: true } });
    return res.data;
};

export const getActivePaymentMethods = async () => {
    const res = await apiClient.get('/payment-methods');
    return res.data;
};

export const getPaymentMethodById = async (methodId) => {
    const res = await apiClient.get(`/payment-methods/${methodId}`);
    return res.data;
};

export const createPaymentMethod = async (methodData) => {
    const res = await apiClient.post('/payment-methods', methodData);
    return res.data;
};

export const updatePaymentMethod = async (methodId, methodData) => {
    const res = await apiClient.put(`/payment-methods/${methodId}`, methodData);
    return res.data;
};

export const updatePaymentMethodStatus = async (methodId, statusData) => {
    const res = await apiClient.patch(`/payment-methods/${methodId}/status`, statusData);
    return res.data;
};

export const deletePaymentMethod = async (methodId) => {
    const res = await apiClient.delete(`/payment-methods/${methodId}`);
    return res.data;
};

export const restorePaymentMethod = async (methodId) => {
    const res = await apiClient.post(`/payment-methods/${methodId}/restore`);
    return res.data;
};
