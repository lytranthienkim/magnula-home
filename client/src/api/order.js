import { API } from "./config";

export const createOrder = async (orderData) => {
    const response = await API.post('/orders', orderData);
    return response.data;
};

export const getOrderById = async (orderId) => {
    const response = await API.get(`/orders/${orderId}`);
    return response.data;
};

export const getOrderByOrderCode = async (orderCode) => {
    const response = await API.get(`/orders/track/${orderCode}`);
    return response.data;
};

export const getOrderItemByOrderId = async (orderId) => {
    const response = await API.get(`/orders/${orderId}/items`);
    return response.data;
};

export const createProductRequest = async (requestData) => {
    const response = await API.post('/product-requests', requestData);
    return response.data;
};

