import { API } from "./config";
import { getCache, setCache, generateCacheKey, removeCache } from "../utils/cache";

export const createOrder = async (orderData) => {
    const response = await API.post('/orders', orderData);
    removeCache(generateCacheKey('orders'));
    return response.data;
};

export const getOrderById = async (orderId) => {
    const cacheKey = generateCacheKey(`orders/${orderId}`);
    const cached = getCache(cacheKey);

    if (cached) {
        return cached;
    }

    const response = await API.get(`/orders/${orderId}`);
    setCache(cacheKey, response.data, 1800000);
    return response.data;
};

export const getOrderByOrderCode = async (orderCode) => {
    const cacheKey = generateCacheKey(`orders/track/${orderCode}`);
    const cached = getCache(cacheKey);

    if (cached) {
        return cached;
    }

    const response = await API.get(`/orders/track/${orderCode}`);
    setCache(cacheKey, response.data, 1800000);
    return response.data;
};

export const getOrderItemByOrderId = async (orderId) => {
    const cacheKey = generateCacheKey(`orders/${orderId}/items`);
    const cached = getCache(cacheKey);

    if (cached) {
        return cached;
    }

    const response = await API.get(`/orders/${orderId}/items`);
    setCache(cacheKey, response.data, 1800000);
    return response.data;
};

export const createProductRequest = async (requestData) => {
    const response = await API.post('/product-requests', requestData);
    return response.data;
};

