import apiClient from './config';

export const getAllOrders = async (limit, offset) => {
  const params = {};
  if (limit !== undefined) params.limit = limit;
  if (offset !== undefined) params.offset = offset;
  const res = await apiClient.get('/orders', { params });
  return res.data;
};

export const getOrderCount = async () => {
  const res = await apiClient.get('/orders', { params: { limit: 1, offset: 0 } });
  return res.data;
};

export const getOrderById = async (orderId) => {
  const res = await apiClient.get(`/orders/${orderId}`);
  return res.data;
};

export const createOrder = async (orderData) => {
  const res = await apiClient.post('/orders', orderData);
  return res.data;
};

export const updateOrder = async (orderId, orderData) => {
  const res = await apiClient.put(`/orders/${orderId}`, orderData);
  return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
  return updateOrder(orderId, { status });
};
