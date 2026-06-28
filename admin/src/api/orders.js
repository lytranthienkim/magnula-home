import apiClient from './config';

// Orders
export const getAllOrders = async () => {
  const res = await apiClient.get('/orders');
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

export const updateOrderStatus = async (orderId, status) => {
  const res = await apiClient.put(`/orders/${orderId}`, { status });
  return res.data;
};

// Product Requests
export const getAllProductRequests = async () => {
  const res = await apiClient.get('/product-requests');
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

// Payment Methods
export const getAllPaymentMethods = async () => {
  const res = await apiClient.get('/payment-methods?includeInactive=true');
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
