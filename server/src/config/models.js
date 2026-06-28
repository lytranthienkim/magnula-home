// Initialize models and setup associations
import db from './db.js';

// Import all models
import User from '../models/rbac/users.model.js';
import Role from '../models/rbac/roles.model.js';
import Permission from '../models/rbac/permissions.model.js';
import UserRole from '../models/rbac/userRoles.model.js';
import RolePermission from '../models/rbac/rolePermissions.model.js';
import Collection from '../models/product/productCollections.model.js';
import CollectionImage from '../models/product/collectionImages.model.js';
import Category from '../models/product/categories.model.js';
import Product from '../models/product/productItems.model.js';
import ProductVariant from '../models/product/productVariants.model.js';
import ProductImage from '../models/product/productImages.model.js';
import Material from '../models/product/materials.model.js';
import FabricType from '../models/product/fabricTypes.model.js';
import RoomSuitability from '../models/product/roomSuitabilities.model.js';
import Order from '../models/order/orders.model.js';
import OrderItem from '../models/order/orderItems.model.js';
import ProductRequest from '../models/order/orderRequests.model.js';
import PaymentMethod from '../models/order/paymentMethods.model.js';
import { setupAssociations } from '../models/association.js';

// Initialize models and attachments
export const initializeModels = () => {
  // Setup associations
  setupAssociations({
    User, Role, Permission, UserRole, RolePermission,
    Collection, CollectionImage, Category, Product, ProductVariant, ProductImage,
    Material, FabricType, RoomSuitability,
    Order, OrderItem, ProductRequest, PaymentMethod
  });

  // Attach models to db so controllers can access them
  db.models = {
    User, Role, Permission, UserRole, RolePermission,
    Collection, CollectionImage, Category, Product, ProductVariant, ProductImage,
    Material, FabricType, RoomSuitability,
    Order, OrderItem, ProductRequest, PaymentMethod
  };
};
