# BACKEND (SERVER)

Backend RESTful API server for Magnula Furniture Online Shop, built with Node.js, Express, MySQL and Redis. The server handles all business logic, user authentication, product management, orders, permissions and image storage.

---

![Magnula database ](https://pub-c0d91e27663a41a5a1671bb31cabfb2a.r2.dev/readme/magnula-sql.png)

## Project Folder Structure

```
server/
├── src/
│   ├── config/              # Database, Redis, Sequelize configuration
│   │   ├── database.js      # Initialize Sequelize instance
│   │   └── redisClient.js   # Initialize Redis client
│   │
│   ├── middleware/          # Middleware for request/response handling
│   │   ├── auth/            # JWT authentication & RBAC verification
│   │   │   └── auth.js
│   │   ├── cache/           # Redis caching middleware
│   │   │   └── cacheMiddleware.js
│   │   └── errorHandler.js  # Global error handling
│   │
│   ├── models/              # Database table definitions (Sequelize Models)
│   │   ├── association.js   # Establish relationships between tables (One-to-Many, Many-to-Many)
│   │   ├── rbac/            # Role-Based Access Control models
│   │   │   ├── user.model.js # System users
│   │   │   ├── role.model.js # Roles
│   │   │   ├── permission.model.js # Permissions
│   │   │   ├── userRole.model.js # User roles
│   │   │   └── rolePermission.model.js # Role permissions
│   │   ├── product/         # Product management models
│   │   │   ├── productItems.model.js     # Products
│   │   │   ├── productVariants.model.js  # Product variants (Overall size, seat size, color, price, stock quantity)
│   │   │   ├── productImages.model.js    # Product images
│   │   │   ├── category.model.js         # Categories
│   │   │   ├── collection.model.js       # Collections
│   │   │   ├── collectionImage.model.js  # Collection images
│   │   │   ├── fabricType.model.js       # Fabric types
│   │   │   ├── material.model.js         # Materials
│   │   │   └── roomSuitability.model.js  # Room suitability classifications
│   │   └── order/           # Order management models
│   │       ├── order.model.js            # Orders
│   │       ├── orderItem.model.js        # Order items
│   │       ├── productRequest.model.js   # Product requests/consultations from customers
│   │       └── paymentMethod.model.js    # Payment methods
│   │
│   ├── controllers/         # Business logic for handling requests
│   │   ├── rbac/            # Authentication, user management, roles, permissions
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── role.controller.js
│   │   │   ├── permission.controller.js
│   │   │   └── assignment.controller.js
│   │   ├── product/         # Product, category, collection, image management
│   │   │   ├── product.controller.js
│   │   │   ├── variant.controller.js
│   │   │   ├── image.controller.js
│   │   │   ├── collection.controller.js
│   │   │   ├── category.controller.js
│   │   │   ├── fabricType.controller.js
│   │   │   ├── material.controller.js
│   │   │   └── roomSuitability.controller.js
│   │   ├── order/           # Order, payment, product request management
│   │   │   ├── order.controller.js
│   │   │   ├── orderItem.controller.js
│   │   │   ├── request.controller.js
│   │   │   └── paymentMethod.controller.js
│   │   └── upload/          # Image upload handling
│   │       └── upload.controller.js
│   │
│   ├── routes/              # Route definitions for API Endpoints
│   │   ├── index.js         # Consolidates all routes
│   │   ├── rbac/            # Routes for auth, user, role, permission
│   │   ├── product/         # Routes for product APIs
│   │   ├── order/           # Routes for order APIs
│   │   └── upload.route.js  # Upload route
│   │
│   ├── hooks/               # Sequelize Hooks - Automatically trigger events
│   │   └── product/
│   │       └── updateProductStockHook.js  # Automatically update product status when stock changes
│   │
│   ├── utils/               # Helper functions, validation, data processing
│   │   ├── validation.js    # Validate input data
│   │   ├── addressValidation.js  # Validate shipping addresses
│   │   ├── orderSearch.js   # Support for order search
│   │   ├── filter/          # Product filtering logic
│   │   └── errorHandler.js  # Common error handling
│   │
│   ├── seeders/             # Initial database data
│   │   ├── seed.js          # Main seeder - creates test admin user with full permissions
│   │   └── magnula_db.sql   # SQL file to create database schema
│   │
│   └── server.js            # Entry point, initialize Express app
│
├── .env                      # Environment variables (contains secrets - don't push to git)
├── .env.example              # .env template for reference
├── package.json              # Dependencies & scripts
└── README.md                 # This file
```

---

## Role Description of Each Main Folder

### `controllers/`
Contains business logic for handling client requests. Each controller defines CRUD and special operation methods:
- **RBAC Controllers**: Login, issue/refresh JWT Tokens, manage users, roles, permissions
- **Product Controllers**: CRUD products, variants (overall size, seat size, color, price, stock quantity), categories, collections, fabric types, materials, room types
- **Order Controllers**: Create orders, update status, manage customer requests
- **Upload Controller**: Handle image uploads to Cloudflare R2

### `hooks/`
Sequelize Hooks - Automatically trigger events when data changes:
- **updateProductStockHook.js**: Automatically update product status ("in stock" / "out of stock") when inventory changes

### `middleware/`
Handle common tasks for all requests or specific routes:
- **auth middleware**: Verify JWT token, check user permissions based on roles (RBAC)
- **cache middleware**: Check Redis cache before DB queries, reduce database load
- **errorHandler**: Global error handling, format error responses

### `models/ & association.js`

#### Main database tables list:

**Users & RBAC (Users & Permission Management)**
- **users**: id, email, password, fullName, phone, countryRegion, stateProvince, shippingAddress, createdAt, updatedAt, deletedAt
- **roles**: id, name (Admin, Staff, Customer), description, createdAt, updatedAt
- **permissions**: id, name (CREATE_PRODUCT, UPDATE_ORDER, etc.), description, createdAt, updatedAt
- **user_roles**: id, userId, roleId (Many-to-Many junction User ↔ Role)
- **role_permissions**: id, roleId, permissionId (Many-to-Many junction Role ↔ Permission)

**Products & Catalog (Products & Catalog)**
- **products**: id, collectionId, categoryId, productName, materialId, fabricTypeId, roomSuitabilityId, status (in stock/out of stock/discontinued), createdAt, updatedAt, deletedAt
- **product_variants**: id, productId, overallSize, seatSize, color, price, stockQuantity, createdAt, updatedAt, deletedAt (Size, price, stock)
- **product_images**: id, productId, imageUrl, createdAt, updatedAt, deletedAt (Product images)
- **collections**: id, name, description, createdAt, updatedAt (Collections)
- **collection_images**: id, collectionId, imageUrl, createdAt, updatedAt (Collection images)
- **categories**: id, categoryName, createdAt, updatedAt (Product categories)
- **materials**: id, name, createdAt, updatedAt (Materials)
- **fabric_types**: id, name, createdAt, updatedAt (Fabric types)
- **room_suitabilities**: id, name, createdAt, updatedAt (Room suitability)

**Orders & Transactions (Orders & Transactions)**
- **orders**: id, orderCode (unique), customerName, customerEmail, customerPhone, countryRegion, stateProvince, shippingAddress, totalPrice, paymentMethodId, status (Pending/Processing/Shipping/Completed/Cancelled), createdAt, updatedAt, deletedAt
- **order_items**: id, orderId, productId, productVariantId, quantity, price, createdAt, updatedAt, deletedAt (Individual items in order)
- **product_requests**: id, productId, productVariantId, customerName, customerPhone, requestedQuantity, description, status (Pending/Approved/Rejected), createdAt, updatedAt (Customer requests: restock/consultation)
- **payment_methods**: id, name, description, createdAt, updatedAt (Payment methods)

#### Table relationships:
- **One-to-Many**: User → Orders, Collection → Products, Product → ProductVariants, etc.
- **Many-to-Many**: Users ← UserRole → Roles (user permissions)
- **Soft Delete**: Models use `paranoid: true` for soft delete (users, products, product_variants, product_images, order_items, product_requests)

### `routes/`

**Main routes:**

**RBAC Routes (routes/rbac/)**
- **auth.route.js**:
  - GET `/auth/check-auth` - Check authentication status
  - GET `/auth/me` - Get current user info (requires auth)
  - POST `/auth/login` - Login
  - POST `/auth/register` - Register account
  - POST `/auth/change-password` - Change password (requires auth)
  - POST `/auth/forgot-password` - Forgot password
  - POST `/auth/check-user-role` - Check user role
  - POST `/auth/reset-password-by-admin` - Reset password
  - POST `/auth/logout` - Logout (requires auth)

- **user.route.js**:
  - GET `/users` - Get user list (requires auth)
  - GET `/users/:id` - Get user details (requires auth)
  - POST `/users` - Create new user
  - PUT `/users/:id` - Update user
  - DELETE `/users/:id` - Delete user

- **role.route.js**:
  - GET `/roles` - Get role list
  - GET `/roles/:id` - Get role details
  - POST `/roles` - Create role
  - PUT `/roles/:id` - Update role
  - DELETE `/roles/:id` - Delete role

- **permission.route.js**:
  - GET `/permissions` - Get permissions list
  - POST `/permissions` - Create permission
  - PUT `/permissions/:id` - Update permission

- **assignment.route.js**:
  - POST `/user-assignments` - Assign role to user
  - DELETE `/user-assignments/:id` - Remove role assignment
  - POST `/role-permissions` - Assign permission to role

**Product Routes (routes/product/)**
- **product.route.js**:
  - GET `/products` - Get product list
  - GET `/products/:id` - Get product details
  - POST `/products` - Create product
  - PUT `/products/:id` - Update product
  - DELETE `/products/:id` - Soft delete product
  - PATCH `/products/:id/restore` - Restore deleted product

- **variant.route.js**:
  - GET `/products/:productId/variants` - Get variant list
  - POST `/products/:productId/variants` - Create variant
  - PUT `/products/variants/:id` - Update variant, stock
  - DELETE `/products/variants/:id` - Delete variant

- **category.route.js**:
  - GET `/products/categories` - Get category list
  - POST `/products/categories` - Create category
  - PUT `/products/categories/:id` - Update category
  - DELETE `/products/categories/:id` - Delete category

- **collection.route.js**:
  - GET `/products/collections` - Get collection list
  - POST `/products/collections` - Create collection
  - PUT `/products/collections/:id` - Update collection
  - DELETE `/products/collections/:id` - Delete collection

- **image.route.js**:
  - POST `/products/:id/images` - Upload product image
  - DELETE `/products/images/:id` - Delete product image

- **collectionImage.route.js**:
  - POST `/products/collections/:collectionId/images` - Upload collection image
  - DELETE `/products/collection-images/:id` - Delete collection image

- **fabricType.route.js**, **material.route.js**, **roomSuitability.route.js**:
  - GET `/products/fabric-types|materials|room-suitabilities` - Get list
  - POST `/products/fabric-types|materials|room-suitabilities` - Create
  - PUT `/products/fabric-types|materials|room-suitabilities/:id` - Update
  - DELETE `/products/fabric-types|materials|room-suitabilities/:id` - Delete

**Order Routes (routes/order/)**
- **order.route.js**:
  - GET `/orders` - Get order list
  - GET `/orders/:id` - Get order details
  - GET `/orders/track/:orderCode` - Track order by code (public, no auth required)
  - POST `/orders` - Create new order
  - PUT `/orders/:id` - Update order

- **orderItem.route.js**:
  - GET `/orders/:orderId/items` - Get order item details
  - POST `/orders/:orderId/items` - Add product to order

- **request.route.js**:
  - GET `/product-requests` - Get customer requests list (requires auth)
  - POST `/product-requests` - Send customer request
  - PUT `/product-requests/:id` - Update request status

- **paymentMethod.route.js**:
  - GET `/payment-methods` - Get payment methods list
  - POST `/payment-methods` - Create payment method
  - PUT `/payment-methods/:id` - Update payment method

**Upload Routes (routes/upload.route.js)**
- POST `/upload` - Upload image to Cloudflare R2
  - Response: `{ success: true, url: "https://..." }`

**Server Health**
- GET `/server` - Check if server is running (no auth required)

### `seeders/`
Contains initial database data:
- **seed.js**: Seeder script to initialize sample admin user in database
  - Email: test@gmail.com
  - Password: admin123
- **magnula_db.sql**: SQL file to create database schema and tables

### `utils/`
Helper functions, validation, common data processing:
- **validation.js**: Validate user info, orders, etc.
- **addressValidation.js**: Validate and process shipping addresses
- **orderSearch.js**: Support for order search, filtering
- **filter/**: Product filter, sorting logic

---

## Environment Variables Configuration (.env Example)

Create `.env` file in server root directory with the following content:

```env
# Server Config
NODE_ENV=development
PORT=3001

# MySQL Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=magnula_home
DB_PORT=3306

# JWT Authentication
JWT_SECRET=
JWT_EXPIRE=7d

# Redis Cache
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_URL=redis://localhost:6379

# Cloudflare R2
CLOUDFLARE_R2_ENDPOINT=
CLOUDFLARE_R2_BUCKET=magnula
CLOUDFLARE_R2_PUBLIC_URL=
CLOUDFLARE_ACCESS_KEY_ID=
CLOUDFLARE_SECRET_ACCESS_KEY=
```

---

## Installation & Setup Process (Step-by-Step Setup)

### Step 1: Clone Repository
```bash
git clone https://github.com/lytranthienkim/magnula-home
cd magnula-home/server
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create .env File
```bash
cp .env.example .env
```

### Step 4: Initialize Database
```bash
mysql -u root -p magnula_home < src/seeders/magnula_db.sql
```

### Step 5: Seed Sample Data
```bash
npm run seed
```

### Step 6: Start Server
```bash
npm run dev
```

**Server will run at: `http://localhost:3001`**

---

## License

This project is referenced and has approval to use data from Magnula Furniture brand (https://www.magnula.com).
