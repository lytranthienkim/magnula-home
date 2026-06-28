/**
 * Permission checking utility
 */

export const checkPermission = (currentUser, permissionKey) => {
  if (!currentUser || !currentUser.permissions) return false;
  return Array.isArray(currentUser.permissions) &&
         currentUser.permissions.includes(permissionKey);
};

export const hasRole = (currentUser, roleName) => {
  if (!currentUser || !currentUser.roles) return false;
  return Array.isArray(currentUser.roles) &&
         currentUser.roles.includes(roleName);
};

export const isAdmin = (currentUser) => {
  return hasRole(currentUser, 'Administrator');
};

// Permission keys for each module
export const PERMISSIONS = {
  PRODUCTS: {
    CREATE: 'products:create',
    READ: 'products:read',
    UPDATE: 'products:update',
    DELETE: 'products:delete',
  },
  CATEGORIES: {
    CREATE: 'category:create',
    READ: 'category:read',
    UPDATE: 'category:update',
    DELETE: 'category:delete',
  },
  COLLECTIONS: {
    CREATE: 'collections:create',
    READ: 'collections:read',
    UPDATE: 'collections:update',
    DELETE: 'collections:delete',
    RESTORE: 'collections:restore',
  },
  MATERIALS: {
    CREATE: 'material:create',
    READ: 'material:read',
    UPDATE: 'material:update',
    DELETE: 'material:delete',
  },
  FABRIC_TYPES: {
    CREATE: 'fabric_type:create',
    READ: 'fabric_type:read',
    UPDATE: 'fabric_type:update',
    DELETE: 'fabric_type:delete',
  },
  ROOM_SUITABILITIES: {
    CREATE: 'room_suitabilities:create',
    READ: 'room_suitabilities:read',
    UPDATE: 'room_suitabilities:update',
    DELETE: 'room_suitabilities:delete',
  },
  ORDERS: {
    CREATE: 'orders:create',
    READ: 'orders:read',
    UPDATE: 'orders:update',
  },
  PAYMENT_METHODS: {
    CREATE: 'payment_methods:create',
    READ: 'payment_methods:read',
    UPDATE: 'payment_methods:update',
    DELETE: 'payment_methods:delete',
  },
};
