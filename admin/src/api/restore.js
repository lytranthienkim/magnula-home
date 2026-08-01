import apiClient from './config';

import { getAllRoles } from './roles';

export const getDeletedProducts = async () => {
  const res = await apiClient.get('/products', { params: { deleted: true } });
  return res.data;
};

export const getDeletedCategories = async () => {
  const res = await apiClient.get('/products/categories', { params: { deleted: true } });
  return res.data;
};

export const getDeletedCollections = async () => {
  const res = await apiClient.get('/products/collections', { params: { deleted: true } });
  return res.data;
};

export const getDeletedMaterials = async () => {
  const res = await apiClient.get('/products/materials', { params: { deleted: true } });
  return res.data;
};

export const getDeletedFabricTypes = async () => {
  const res = await apiClient.get('/products/fabric-types', { params: { deleted: true } });
  return res.data;
};

export const getDeletedRoomSuitabilities = async () => {
  const res = await apiClient.get('/products/room-suitabilities', { params: { deleted: true } });
  return res.data;
};

export const getDeletedImages = async () => {
  const res = await apiClient.get('/products/images', { params: { deleted: true } });
  return res.data;
};

export const getDeletedUsers = async () => {
  const res = await apiClient.get('/users', { params: { deleted: true } });
  return res.data;
};

export const getDeletedRoles = async () => {
  return getAllRoles(true);
};

export const getDeletedPermissions = async () => {
  const res = await apiClient.get('/permissions', { params: { deleted: true } });
  return res.data;
};

export const getDeletedOrders = async () => {
  const res = await apiClient.get('/orders', { params: { deleted: true } });
  return res.data;
};

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
