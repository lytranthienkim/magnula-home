import { API } from "./config";

export const createOrder = async (orderData) => {
    const response = await API.post('/api/orders', orderData);
    return response.data;
};

export const getOrderById = async (orderId) => {
    const response = await API.get(`/api/orders/${orderId}`);
    return response.data;
};

export const getOrderByOrderCode = async (orderCode) => {
    const response = await API.get(`/api/orders/track/${orderCode}`);
    return response.data;
};

export const getOrderItemByOrderId = async (orderId) => {
    const response = await API.get(`/api/orders/${orderId}/items`);
    return response.data;
};

export const createProductRequest = async (requestData) => {
    const response = await API.post('/api/product-requests', requestData);
    return response.data;
};

