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
  
  // Users (1) ---> (N) UserRoles 
  User.hasMany(UserRole, { foreignKey: 'userId', as: 'userRoles' });
  UserRole.belongsTo(User, { foreignKey: 'userId' });

  // Roles (1) ---> (N) UserRoles 
  Role.hasMany(UserRole, { foreignKey: 'roleId', as: 'roleUsers' });
  UserRole.belongsTo(Role, { foreignKey: 'roleId' });

  // Roles (1) ---> (N) RolePermissions
  Role.hasMany(RolePermission, { foreignKey: 'roleId', as: 'rolePermissions' });
  RolePermission.belongsTo(Role, { foreignKey: 'roleId' });

  // Permissions (1) ---> (N) RolePermissions
  Permission.hasMany(RolePermission, { foreignKey: 'permissionId', as: 'permissionRoles' });
  RolePermission.belongsTo(Permission, { foreignKey: 'permissionId' });

  // Collections (1) ---> (N) Products
  Collection.hasMany(Product, { foreignKey: 'collectionId', as: 'products' });
  Product.belongsTo(Collection, { foreignKey: 'collectionId' });

  // Collections (1) ---> (N) CollectionImages
  Collection.hasMany(CollectionImage, { foreignKey: 'collectionId', as: 'images' });
  CollectionImage.belongsTo(Collection, { foreignKey: 'collectionId' });

  // Categories (1) ---> (N) Products
  Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
  Product.belongsTo(Category, { foreignKey: 'categoryId' });

  // Materials (1) ---> (N) Products
  Material.hasMany(Product, { foreignKey: 'materialId', as: 'products' });
  Product.belongsTo(Material, { foreignKey: 'materialId' });

  // FabricTypes (1) ---> (N) Products
  FabricType.hasMany(Product, { foreignKey: 'fabricTypeId', as: 'products' });
  Product.belongsTo(FabricType, { foreignKey: 'fabricTypeId' });

  // RoomSuitabilities (1) ---> (N) Products
  RoomSuitability.hasMany(Product, { foreignKey: 'roomSuitabilityId', as: 'products' });
  Product.belongsTo(RoomSuitability, { foreignKey: 'roomSuitabilityId' });

  // Products (1) ---> (N) ProductVariants
  Product.hasMany(ProductVariant, { foreignKey: 'productId', as: 'variants' });
  ProductVariant.belongsTo(Product, { foreignKey: 'productId' });

  // Products (1) ---> (N) ProductImages
  Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });
  ProductImage.belongsTo(Product, { foreignKey: 'productId' });

  // PaymentMethods (1) ---> (N) Orders
  PaymentMethod.hasMany(Order, { foreignKey: 'paymentMethodId', as: 'orders' });
  Order.belongsTo(PaymentMethod, { foreignKey: 'paymentMethodId' });

  // Orders (1) ---> (N) OrderItems
  Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
  OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

  // Products (1) ---> (N) OrderItems
  Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
  OrderItem.belongsTo(Product, { foreignKey: 'productId' });

  // ProductVariants (1) ---> (N) OrderItems
  ProductVariant.hasMany(OrderItem, { foreignKey: 'productVariantId', as: 'variantOrderItems' });
  OrderItem.belongsTo(ProductVariant, { foreignKey: 'productVariantId' });

  // Products (1) ---> (N) ProductRequests
  Product.hasMany(ProductRequest, { foreignKey: 'productId', as: 'requests' });
  ProductRequest.belongsTo(Product, { foreignKey: 'productId' });

  // ProductVariants (1) ---> (N) ProductRequests 
  ProductVariant.hasMany(ProductRequest, { foreignKey: 'productVariantId', as: 'requests' });
  ProductRequest.belongsTo(ProductVariant, { foreignKey: 'productVariantId' }); 
};
