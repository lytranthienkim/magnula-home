import apiClient from './config';

// Products
export const getAllProducts = async (limit, offset) => {
  const params = new URLSearchParams();
  if (limit !== undefined) params.append('limit', limit);
  if (offset !== undefined) params.append('offset', offset);
  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await apiClient.get(`/products${query}`);
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

// Product Variants
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

// Product Images
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

// Collections
export const getAllCollections = async () => {
  const res = await apiClient.get('/products/collections');
  return res.data;
};

export const getCollectionById = async (collectionId) => {
  const res = await apiClient.get(`/products/collections/${collectionId}`);
  return res.data;
};

export const createCollection = async (collectionData) => {
  const res = await apiClient.post('/products/collections', collectionData);
  return res.data;
};

export const updateCollection = async (collectionId, collectionData) => {
  const res = await apiClient.put(`/products/collections/${collectionId}`, collectionData);
  return res.data;
};

export const updateCollectionStatus = async (collectionId, status) => {
  const res = await apiClient.patch(`/products/collections/${collectionId}/status`, { status });
  return res.data;
};

export const deleteCollection = async (collectionId) => {
  const res = await apiClient.delete(`/products/collections/${collectionId}`);
  return res.data;
};

export const restoreCollection = async (collectionId) => {
  const res = await apiClient.post(`/products/collections/${collectionId}/restore`);
  return res.data;
};

// Collection Images
export const getAllCollectionImages = async () => {
  const res = await apiClient.get('/products/collection-images');
  return res.data;
};

export const getCollectionImages = async (collectionId) => {
  const res = await apiClient.get(`/products/collections/${collectionId}/images`);
  return res.data;
};

export const addCollectionImage = async (collectionId, imageData) => {
  const res = await apiClient.post(`/products/collection-images`, { ...imageData, collectionId });
  return res.data;
};

export const updateCollectionImage = async (imageId, imageData) => {
  const res = await apiClient.put(`/products/collection-images/${imageId}`, imageData);
  return res.data;
};

export const deleteCollectionImage = async (imageId) => {
  const res = await apiClient.delete(`/products/collection-images/${imageId}`);
  return res.data;
};

// Categories
export const getAllCategories = async () => {
  const res = await apiClient.get('/products/categories');
  return res.data;
};

export const createCategory = async (categoryData) => {
  const res = await apiClient.post('/products/categories', categoryData);
  return res.data;
};

export const updateCategory = async (categoryId, categoryData) => {
  const res = await apiClient.put(`/products/categories/${categoryId}`, categoryData);
  return res.data;
};

export const updateCategoryStatus = async (categoryId, status) => {
  const res = await apiClient.patch(`/products/categories/${categoryId}/status`, { status });
  return res.data;
};

export const deleteCategory = async (categoryId) => {
  const res = await apiClient.delete(`/products/categories/${categoryId}`);
  return res.data;
};

export const restoreCategory = async (categoryId) => {
  const res = await apiClient.post(`/products/categories/${categoryId}/restore`);
  return res.data;
};

// Images (General)
export const getAllImages = async () => {
  const res = await apiClient.get('/products/images');
  return res.data;
};

export const getImageById = async (imageId) => {
  const res = await apiClient.get(`/products/images/${imageId}`);
  return res.data;
};

export const updateImage = async (imageId, imageData) => {
  const res = await apiClient.put(`/products/images/${imageId}`, imageData);
  return res.data;
};

export const restoreImage = async (imageId) => {
  const res = await apiClient.post(`/products/images/${imageId}/restore`);
  return res.data;
};
