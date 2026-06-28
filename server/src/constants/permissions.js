// Permission Keys - Centralized constant for all system permissions
// Format: `resource:action` (colon separator, lowercase)
// This ensures consistency across the entire application

export const PERMISSIONS = {
  // Dashboard & System
  DASHBOARD_READ: 'dashboard:read',

  // User Management
  USERS_READ: 'users:read',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
  USERS_UPDATE_PASSWORD: 'users:update_password',
  USERS_UPDATE_STATUS: 'users:update_status',

  // Product Management
  PRODUCTS_READ: 'products:read',
  PRODUCTS_CREATE: 'products:create',
  PRODUCTS_UPDATE: 'products:update',
  PRODUCTS_DELETE: 'products:delete',

  // Categories
  CATEGORIES_READ: 'categories:read',
  CATEGORIES_CREATE: 'categories:create',
  CATEGORIES_UPDATE: 'categories:update',
  CATEGORIES_DELETE: 'categories:delete',

  // Fabric Types
  FABRIC_TYPES_READ: 'fabric_types:read',
  FABRIC_TYPES_CREATE: 'fabric_types:create',
  FABRIC_TYPES_UPDATE: 'fabric_types:update',
  FABRIC_TYPES_DELETE: 'fabric_types:delete',

  // Room Suitabilities
  ROOM_SUITABILITIES_READ: 'room_suitabilities:read',
  ROOM_SUITABILITIES_CREATE: 'room_suitabilities:create',
  ROOM_SUITABILITIES_UPDATE: 'room_suitabilities:update',
  ROOM_SUITABILITIES_DELETE: 'room_suitabilities:delete',

  // Collections
  COLLECTIONS_READ: 'collections:read',
  COLLECTIONS_CREATE: 'collections:create',
  COLLECTIONS_UPDATE: 'collections:update',
  COLLECTIONS_DELETE: 'collections:delete',

  // Collection Images
  COLLECTION_IMAGES_READ: 'collection_images:read',
  COLLECTION_IMAGES_CREATE: 'collection_images:create',
  COLLECTION_IMAGES_UPDATE: 'collection_images:update',
  COLLECTION_IMAGES_DELETE: 'collection_images:delete',

  // Product Images
  PRODUCT_IMAGES_READ: 'product_images:read',
  PRODUCT_IMAGES_CREATE: 'product_images:create',
  PRODUCT_IMAGES_UPDATE: 'product_images:update',
  PRODUCT_IMAGES_DELETE: 'product_images:delete',

  // Product Variants
  PRODUCT_VARIANTS_READ: 'product_variants:read',
  PRODUCT_VARIANTS_CREATE: 'product_variants:create',
  PRODUCT_VARIANTS_UPDATE: 'product_variants:update',
  PRODUCT_VARIANTS_DELETE: 'product_variants:delete',

  // Materials
  MATERIALS_READ: 'materials:read',
  MATERIALS_CREATE: 'materials:create',
  MATERIALS_UPDATE: 'materials:update',
  MATERIALS_DELETE: 'materials:delete',

  // Orders
  ORDERS_READ: 'orders:read',
  ORDERS_CREATE: 'orders:create',
  ORDERS_UPDATE: 'orders:update',
  ORDERS_DELETE: 'orders:delete',

  // Order Requests (FIXED TYPO: was 'orders_requets')
  ORDER_REQUESTS_READ: 'order_requests:read',
  ORDER_REQUESTS_CREATE: 'order_requests:create',
  ORDER_REQUESTS_UPDATE: 'order_requests:update',
  ORDER_REQUESTS_DELETE: 'order_requests:delete',

  // Order Items
  ORDER_ITEMS_READ: 'order_items:read',
  ORDER_ITEMS_CREATE: 'order_items:create',
  ORDER_ITEMS_UPDATE: 'order_items:update',
  ORDER_ITEMS_DELETE: 'order_items:delete',

  // Payment Methods
  PAYMENT_METHODS_READ: 'payment_methods:read',
  PAYMENT_METHODS_CREATE: 'payment_methods:create',
  PAYMENT_METHODS_UPDATE: 'payment_methods:update',
  PAYMENT_METHODS_DELETE: 'payment_methods:delete',

  // Roles
  ROLES_READ: 'roles:read',
  ROLES_CREATE: 'roles:create',
  ROLES_UPDATE: 'roles:update',
  ROLES_DELETE: 'roles:delete',

  // Permissions
  PERMISSIONS_READ: 'permissions:read',
  PERMISSIONS_CREATE: 'permissions:create',
  PERMISSIONS_UPDATE: 'permissions:update',
  PERMISSIONS_DELETE: 'permissions:delete',

  // Role Assignments
  ROLES_ASSIGN_TO_USER: 'roles:assign_to_user',

  // Permission Assignments
  PERMISSIONS_ASSIGN_TO_ROLE: 'permissions:assign_to_role',
};

// Get all permission keys as array (for bootstrap)
export const getAllPermissionKeys = () => {
  return Object.values(PERMISSIONS);
};

// Default admin permissions (all permissions)
export const getAdminPermissions = () => {
  return getAllPermissionKeys();
};

// Default staff permissions (limited subset)
export const getStaffPermissions = () => {
  return [
    PERMISSIONS.DASHBOARD_READ,
    PERMISSIONS.PRODUCTS_READ,
    PERMISSIONS.CATEGORIES_READ,
    PERMISSIONS.COLLECTIONS_READ,
    PERMISSIONS.FABRIC_TYPES_READ,
    PERMISSIONS.ROOM_SUITABILITIES_READ,
    PERMISSIONS.MATERIALS_READ,
    PERMISSIONS.ORDERS_READ,
    PERMISSIONS.ORDER_REQUESTS_READ,
  ];
};

// Default user permissions (minimal subset)
export const getUserPermissions = () => {
  return [
    PERMISSIONS.DASHBOARD_READ,
    PERMISSIONS.PRODUCTS_READ,
    PERMISSIONS.COLLECTIONS_READ,
  ];
};
