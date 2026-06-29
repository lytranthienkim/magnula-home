import apiClient from './config';
import { getAllRoles } from './roles';

// Get deleted products
export const getDeletedProducts = async () => {
  const res = await apiClient.get('/products?deleted=true');
  return res.data;
};

// Get deleted categories
export const getDeletedCategories = async () => {
  const res = await apiClient.get('/products/categories?deleted=true');
  return res.data;
};

// Get deleted collections
export const getDeletedCollections = async () => {
  const res = await apiClient.get('/products/collections?deleted=true');
  return res.data;
};

// Get deleted materials
export const getDeletedMaterials = async () => {
  const res = await apiClient.get('/products/materials?deleted=true');
  return res.data;
};

// Get deleted fabric types
export const getDeletedFabricTypes = async () => {
  const res = await apiClient.get('/products/fabric-types?deleted=true');
  return res.data;
};

// Get deleted room suitabilities
export const getDeletedRoomSuitabilities = async () => {
  const res = await apiClient.get('/products/room-suitabilities?deleted=true');
  return res.data;
};

// Get deleted images
export const getDeletedImages = async () => {
  const res = await apiClient.get('/products/images?deleted=true');
  return res.data;
};

// Get deleted users
export const getDeletedUsers = async () => {
  const res = await apiClient.get('/users?deleted=true');
  return res.data;
};

// Get deleted roles
export const getDeletedRoles = async () => {
  return getAllRoles(true);
};

// Get deleted permissions
export const getDeletedPermissions = async () => {
  const res = await apiClient.get('/permissions?deleted=true');
  return res.data;
};

// Get deleted orders
export const getDeletedOrders = async () => {
  const res = await apiClient.get('/orders?deleted=true');
  return res.data;
};

// Generic restore function
export const restoreItem = async (type, itemId) => {
  const endpoints = {
    products: `/products/${itemId}/restore`,
    categories: `/products/categories/${itemId}/restore`,
    collections: `/products/collections/${itemId}/restore`,
    materials: `/products/materials/${itemId}/restore`,
    'fabric-types': `/products/fabric-types/${itemId}/restore`,
    'room-suitabilities': `/products/room-suitabilities/${itemId}/restore`,
    images: `/products/images/${itemId}/restore`,
    users: `/users/${itemId}/restore`,
    roles: `/roles/${itemId}/restore`,
    permissions: `/permissions/${itemId}/restore`,
    orders: `/orders/${itemId}/restore`,
  };

  const res = await apiClient.patch(endpoints[type]);
  return res.data;
};
