import { invalidateCache } from './cacheMiddleware.js';

export const invalidateProductCache = async () => {
  await invalidateCache('cache:/api/products*');
};

export const invalidateCategoryCache = async () => {
  await invalidateCache('cache:/api/products/categories*');
};

export const invalidateCollectionCache = async () => {
  await invalidateCache('cache:/api/products/collections*');
};

export const invalidateFabricTypeCache = async () => {
  await invalidateCache('cache:/api/products/fabric-types*');
};

export const invalidateMaterialCache = async () => {
  await invalidateCache('cache:/api/products/materials*');
};

export const invalidateRoomSuitabilityCache = async () => {
  await invalidateCache('cache:/api/products/room-suitabilities*');
};

export const invalidateOrderCache = async () => {
  await invalidateCache('cache:/api/orders*');
};
