import apiClient from './config';

export const getAllProducts = async (limit, offset) => {
  const params = {};
  if (limit !== undefined) params.limit = limit;
  if (offset !== undefined) params.offset = offset;
  const res = await apiClient.get('/products', { params });
  return res.data;
};

export const getProductById = async (productId) => {
  const res = await apiClient.get(`/products/${productId}`);
  return res.data;
};

export const createProduct = async (productData) => {
  const res = await apiClient.post('/products', productData);
  return res.data;
};

export const updateProduct = async (productId, productData) => {
  const res = await apiClient.put(`/products/${productId}`, productData);
  return res.data;
};

export const deleteProduct = async (productId) => {
  const res = await apiClient.delete(`/products/${productId}`);
  return res.data;
};

export const restoreProduct = async (productId) => {
  const res = await apiClient.post(`/products/${productId}/restore`);
  return res.data;
};
