export const setupAssociations = ({
  User,
  Role,
  Permission,
  UserRole,
  RolePermission,
  Collection,
  CollectionImage,
  Category,
  Product,
  ProductVariant,
  ProductImage,
  Material,
  FabricType,
  RoomSuitability,
  Order,
  OrderItem,
  ProductRequest,
  PaymentMethod,
}) => {
  
  // Users
  User.hasMany(UserRole, { foreignKey: 'userId', as: 'userRoles' });
  UserRole.belongsTo(User, { foreignKey: 'userId' });

  // Roles
  Role.hasMany(UserRole, { foreignKey: 'roleId', as: 'roleUsers' });
  UserRole.belongsTo(Role, { foreignKey: 'roleId' });

  // Roles
  Role.hasMany(RolePermission, { foreignKey: 'roleId', as: 'rolePermissions' });
  RolePermission.belongsTo(Role, { foreignKey: 'roleId' });

  // Permissions
  Permission.hasMany(RolePermission, { foreignKey: 'permissionId', as: 'permissionRoles' });
  RolePermission.belongsTo(Permission, { foreignKey: 'permissionId' });

  // Collections
  Collection.hasMany(Product, { foreignKey: 'collectionId', as: 'products' });
  Product.belongsTo(Collection, { foreignKey: 'collectionId' });

  // Collections
  Collection.hasMany(CollectionImage, { foreignKey: 'collectionId', as: 'images' });
  CollectionImage.belongsTo(Collection, { foreignKey: 'collectionId' });

  // Categories
  Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
  Product.belongsTo(Category, { foreignKey: 'categoryId' });

  // Materials
  Material.hasMany(Product, { foreignKey: 'materialId', as: 'products' });
  Product.belongsTo(Material, { foreignKey: 'materialId' });

  // FabricTypes
  FabricType.hasMany(Product, { foreignKey: 'fabricTypeId', as: 'products' });
  Product.belongsTo(FabricType, { foreignKey: 'fabricTypeId' });

  // RoomSuitabilities
  RoomSuitability.hasMany(Product, { foreignKey: 'roomSuitabilityId', as: 'products' });
  Product.belongsTo(RoomSuitability, { foreignKey: 'roomSuitabilityId' });

  // Products
  Product.hasMany(ProductVariant, { foreignKey: 'productId', as: 'variants' });
  ProductVariant.belongsTo(Product, { foreignKey: 'productId' });

  // Products
  Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });
  ProductImage.belongsTo(Product, { foreignKey: 'productId' });

  // PaymentMethods
  PaymentMethod.hasMany(Order, { foreignKey: 'paymentMethodId', as: 'orders' });
  Order.belongsTo(PaymentMethod, { foreignKey: 'paymentMethodId' });

  // Orders
  Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
  OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

  // Products
  Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
  OrderItem.belongsTo(Product, { foreignKey: 'productId' });

  // ProductVariants
  ProductVariant.hasMany(OrderItem, { foreignKey: 'productVariantId', as: 'variantOrderItems' });
  OrderItem.belongsTo(ProductVariant, { foreignKey: 'productVariantId' });

  // Products
  Product.hasMany(ProductRequest, { foreignKey: 'productId', as: 'requests' });
  ProductRequest.belongsTo(Product, { foreignKey: 'productId' });

  // ProductVariants 
  ProductVariant.hasMany(ProductRequest, { foreignKey: 'productVariantId', as: 'requests' });
  ProductRequest.belongsTo(ProductVariant, { foreignKey: 'productVariantId' }); 
};
