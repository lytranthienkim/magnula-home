# ADMIN DASHBOARD

Admin control panel for Magnula Furniture Online Shop, built with Next.js 16.2.6, React 19.2.4, Redux Toolkit, Recharts and Tailwind CSS. The application provides a comprehensive management interface for products, orders, users, access control, and other features.

---

![Magnula admin ui](https://pub-c0d91e27663a41a5a1671bb31cabfb2a.r2.dev/readme/admin-magnula.MOV)

## Admin Dashboard Folder Structure

```
admin/
├── src/
│   ├── app/                 # Next.js App Router - Routing, Layouts, Pages
│   │   ├── layout.js        # Root layout
│   │   ├── error.js         # Error boundary
│   │   ├── auth/            # Authentication pages
│   │   │   ├── login/page.jsx       # Login page
│   │   │   └── forgot-password/page.jsx # Password recovery page
│   │   └── dashboard/       # Main dashboard page
│   │       ├── layout.jsx   # Dashboard layout
│   │       ├── page.jsx     # Dashboard overview
│   │       ├── account/     # Account management
│   │       │   ├── profile/page.jsx # Personal information
│   │       │   └── change-password/page.jsx # Change password
│   │       ├── control/     # Access control
│   │       │   ├── users/page.jsx   # User management
│   │       │   ├── roles/page.jsx   # Role management
│   │       │   ├── permissions/page.jsx # Permission management
│   │       │   └── access-control/page.jsx # Access control
│   │       ├── product-management/ # Product management
│   │       │   ├── products/page.jsx # Product list
│   │       │   ├── categories/page.jsx # Product categories
│   │       │   └── collections/page.jsx # Collections
│   │       ├── variant-management/ # Variant management
│   │       │   ├── fabric-types/page.jsx # Fabric types
│   │       │   ├── materials/page.jsx   # Materials
│   │       │   └── room-suitabilities/page.jsx # Room suitabilities
│   │       ├── image-management/ # Image management
│   │       │   ├── images/page.jsx  # Product images
│   │       │   └── collection-images/page.jsx # Collection images
│   │       ├── order-management/ # Order management
│   │       │   ├── orders/page.jsx # Order list
│   │       │   ├── payment-methods/page.jsx # Payment methods
│   │       │   └── product-requests/page.jsx # Product requests
│   │       └── restore/page.jsx    # Data restore
│   │
│   ├── components/          # UI Components
│   │   ├── common/          # Common components
│   │   │   ├── AuthInitializer.jsx # Auth initialization component
│   │   │   ├── Pagination.jsx      # Pagination component
│   │   │   ├── form/
│   │   │   │   └── FormField.jsx   # Reusable form field component
│   │   │   ├── modals/
│   │   │   │   ├── DeleteModal.jsx     # Delete confirmation modal
│   │   │   │   ├── ConfirmModal.jsx    # Generic confirmation modal
│   │   │   │   └── RestoreModal.jsx    # Restore data modal
│   │   │   └── table/
│   │   │       └── Table.jsx       # Reusable table component
│   │   │
│   │   └── layout/          # Layout components (22 feature folders)
│   │       ├── navigate/    # Navigation (Sidebar, Topbar)
│   │       ├── dashboard/   # Dashboard overview components
│   │       ├── products/    # Product management components
│   │       ├── categories/  # Category management components
│   │       ├── collections/ # Collection management components
│   │       ├── roles/       # Role management components
│   │       ├── users/       # User management components
│   │       ├── permissions/ # Permission management components
│   │       ├── access-control/ # Access control management components
│   │       ├── materials/   # Material management components
│   │       ├── fabric-types/ # Fabric type management components
│   │       ├── room-suitabilities/ # Room suitability management components
│   │       ├── images/      # Image management components
│   │       ├── product-images/ # Product image management components
│   │       ├── collection-images/ # Collection image management components
│   │       ├── orders/      # Order management components
│   │       ├── payment-methods/ # Payment method management components
│   │       ├── product-requests/ # Product request management components
│   │       ├── profile/     # User profile components
│   │       ├── change-password/ # Change password components
│   │       └── restore/     # Data restore components
│   │
│   ├── redux/               # Global State Management
│   │   ├── store.js         # Redux store configuration
│   │   ├── Provider.jsx     # Redux Provider wrapper
│   │   └── authSlice.js     # Authentication state slice
│   │
│   ├── api/                 # Axios instance & API calling functions (23 files)
│   │   ├── config.js        # Axios base instance, interceptors
│   │   ├── auth.js          # Authentication API endpoints
│   │   ├── products.js      # Product CRUD endpoints
│   │   ├── category.js      # Category management endpoints
│   │   ├── collection.js    # Collection endpoints
│   │   ├── users.js         # User management endpoints
│   │   ├── roles.js         # Role CRUD endpoints
│   │   ├── permissions.js   # Permission endpoints
│   │   ├── permission.js    # Access control endpoints
│   │   ├── materials.js     # Material CRUD endpoints
│   │   ├── fabricType.js    # Fabric type endpoints
│   │   ├── roomSuitabilities.js # Room suitability endpoints
│   │   ├── image.js         # Image management endpoints
│   │   ├── collectionImage.js # Collection image endpoints
│   │   ├── productImage.js  # Product image endpoints
│   │   ├── orders.js        # Order endpoints
│   │   ├── paymentMethod.js # Payment method endpoints
│   │   ├── productRequest.js # Product request endpoints
│   │   ├── productVariant.js # Product variant endpoints
│   │   ├── restore.js       # Data restore endpoints
│   │   ├── upload.js        # File upload endpoints
│   │   └── country.js       # Country/region API endpoints
│   │
│   ├── hooks/               # Custom React hooks
│   │   └── (custom hooks files)
│   │
│   ├── config/              # Configuration
│   │   └── env.js           # Environment variables setup
│   │
│   ├── constants/           # App constants & configurations
│   │   └── statuses.js      # Status constants (order statuses, user statuses, etc.)
│   │
│   └── styles/              # Styling system
│       └── (global CSS files)
│
├── public/                  # Static assets
│   └── (images, icons, favicon, etc.)
│
├── jsconfig.json            # JavaScript configuration
├── package.json             # Dependencies & npm scripts
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
└── README.md                # This file
```

---

## Application Architecture - Clean Architecture

### `src/app/` - Next.js App Router
Manages routing and layout of the admin control panel using Next.js 16 App Router:

**Authentication Pages:**
- **auth/login/**: Login page
- **auth/forgot-password/**: Password recovery page

**Dashboard Main:**
- **dashboard/page.jsx**: Main page with dashboard overview

**Account Management:**
- **dashboard/account/profile/**: View and update user profile
- **dashboard/account/change-password/**: Change password

**Access Control (Control):**
- **dashboard/control/users/**: User management
- **dashboard/control/roles/**: Role management
- **dashboard/control/permissions/**: Permission management
- **dashboard/control/access-control/**: Access control

**Product Management:**
- **dashboard/product-management/products/**: Product list (CRUD)
- **dashboard/product-management/categories/**: Category management
- **dashboard/product-management/collections/**: Collection management

**Variant Management:**
- **dashboard/variant-management/fabric-types/**: Fabric type management
- **dashboard/variant-management/materials/**: Material management
- **dashboard/variant-management/room-suitabilities/**: Room suitability management

**Image Management:**
- **dashboard/image-management/images/**: Product image management
- **dashboard/image-management/collection-images/**: Collection image management

**Order Management:**
- **dashboard/order-management/orders/**: Order management
- **dashboard/order-management/payment-methods/**: Payment method management
- **dashboard/order-management/product-requests/**: Product request management

**Data Restore:**
- **dashboard/restore/**: Restore deleted data

### `src/components/` - Reusable UI Components
Reusable components organized by functionality:

**common/** - Common, reusable components:
- **form/**: Reusable form components
- **modals/**: Modal components (shared modals)
- **table/**: Reusable table components

**layout/** - Layout components by feature:
- **navigate/**: Sidebar navigation, Topbar (notifications, search, user menu)
- **dashboard/**: Dashboard overview components
- **products/**: ProductsHeader, ProductsTable, ProductsModal, ProductsAddForm
- **categories/**: Category management components
- **collections/**: Collection management components
- **roles/**: RolesHeader, RolesTable, RolesModal
- **users/**: User management components
- **permissions/**: PermissionsHeader, PermissionsTable, PermissionsModal
- **access-control/**: Access control management components
- **materials/**: MaterialsHeader, MaterialsTable, MaterialsModal, MaterialsAddForm
- **fabric-types/**: Fabric type management components
- **room-suitabilities/**: RoomsuitabilitiesHeader, RoomsuitabilitiesTable, RoomsuitabilitiesModal, RoomSuitabilitiesAddForm
- **images/**: ImagesHeader and image management
- **product-images/**: Product image management components
- **collection-images/**: CollectionImageModal, CollectionImagesHeader
- **orders/**: Order management components
- **payment-methods/**: Payment method management components
- **product-requests/**: Product request management components
- **profile/**: User profile components
- **change-password/**: Change password form components
- **restore/**: Data restore components

### `src/redux/` - Global State Management
Global state management using Redux Toolkit:
- **store.js**: Redux store configuration
- **Provider.jsx**: Redux Provider wrapper component
- **authSlice.js**: Authentication state (login, logout, user info, token)

### `src/api/` - API & Data Fetching
Comprehensive collection of API endpoints for CRUD operations:

**Authentication & User Management:**
- **config.js**: Axios base instance configuration, interceptors
- **auth.js**: Authentication endpoints (login, register, logout)
- **users.js**: User CRUD endpoints

**Product Management:**
- **products.js**: Product CRUD endpoints
- **category.js**: Category management endpoints
- **collection.js**: Collection endpoints
- **productImage.js**: Product image endpoints
- **productVariant.js**: Product variant endpoints

**Variant & Filter Options:**
- **materials.js**: Material endpoints
- **fabricType.js**: Fabric type endpoints
- **roomSuitabilities.js**: Room suitability endpoints

**Access Control:**
- **roles.js**: Role CRUD endpoints
- **permissions.js**: Permission CRUD endpoints (listing)
- **permission.js**: Access control endpoints (assignment)

**Image Management:**
- **image.js**: Image management endpoints
- **collectionImage.js**: Collection image endpoints
- **upload.js**: File upload endpoints

**Order Management:**
- **orders.js**: Order endpoints
- **paymentMethod.js**: Payment method endpoints
- **productRequest.js**: Product request endpoints

**Utilities:**
- **restore.js**: Data restore endpoints (recover deleted items)
- **country.js**: Country/region endpoints

### `src/hooks/` - Custom React Hooks
Custom hooks for managing component logic and state management

### `src/config/` - Configuration
- **env.js**: Environment variables setup (API_URL, etc.)

### `src/constants/` - Constants
- **statuses.js**: Status constants (order statuses, user statuses, etc.)

### `src/styles/` - Styling System
- Global styles, Tailwind CSS configuration
- Custom CSS files

---

## Main Features

### 1. Authentication & Account Management

**Login Page (Auth/Login):**
- Login form with email/username and password
- User information authentication
- Create session and JWT token
- Store token on client side

**Password Recovery (Forgot Password):**
- Email input form to request password recovery
- Check if user email has role with permission to change password, if login email has role without this permission, user must report to higher authority to change password for user.

**Account Management (Account Management):**
- **Personal Profile (Profile)**:
  - View personal information
  - Update personal information
  - Change personal information
- **Change Password (Change Password)**:
  - Enter old password form
  - Enter new password form
  - New password validation

### 2. Access Control

**User Management (Users Management):**
- **User List:** (Depending on role with permission granted, display user management page)
  - Table displaying all users
  - Display columns: email, name, role, status, creation date
- **Add User (Add User):**
  - Form to add new user (UsersAddForm)
  - Enter email, password, name, phone number
  - Assign role to new user
- **Edit User Information (Edit):**
  - Modal to edit user information (UsersModal)
  - Update email, name, phone number
  - Change user role
- **Delete User (Delete):**
  - Soft delete user
  - Display confirmation modal before deletion
- **Status Management:**
  - Lock/unlock user accounts
  - Update activity status

**Role Management (Roles Management):** (Depending on role with permission granted, display role management page)
- **Role List:**
  - Table displaying all roles (admin, manager, staff, user)
  - Display number of permissions for each role
- **Add Role:**
  - Modal to add new role
  - Enter role name, description
- **Edit Role:**
  - Modal to edit role information
  - Update name, description
- **Delete Role:**
  - Delete role (with confirmation)
  - Check to prevent deletion of roles in use

**Permission Management (Permissions Management):** (Depending on role with permission granted, display permission management page)
- **Permission List:**
  - Table displaying all permissions
  - Classify permissions by resource (products:read, users:create, etc.)

**Access Control (Access Control):**
- **Assign Permissions to Roles:**
  - Select role
  - Display list of permissions
  - Select/deselect permissions
  - Save permission assignment

### 3. Product Management

**Product List (Products):**
- **Product Table (ProductsTable):**
  - Display all products
  - Columns: ID, name, category, collection, price, inventory, status
  - Pagination
  - Search by product name
  - Filter by category, collection, status
- **Add Product (ProductsAddForm):**
  - Complete form to add new product
  - Enter product name, description, price
  - Select category, collection
  - Upload main image
  - Select variants (size, color, material)
  - Enter inventory
- **Edit Product (Edit):**
  - Modal to edit product information (ProductsModal)
  - Update name, description, price, inventory
  - Change category, collection
  - Manage images
- **Delete Product:**
  - Soft delete (mark product as deleted)
  - Confirmation modal before deletion
  - Can be restored from Restore page

**Category Management (Categories):**
- Product category list
- Add new category (name, description)
- Edit category information
- Delete category (if no products)

**Collection Management (Collections):**
- **Collection List:**
  - Table displaying collections
  - Columns: name, description, number of products, creation date
- **Add Collection:**
  - Form to add new collection
  - Enter name, description
  - Select collection image
- **Edit Collection:**
  - Update name, description, image
- **Assign Products:**
  - Select products for collection
  - Update product list
- **Delete Collection:**
  - Delete collection

### 4. Variant Management

**Fabric Types (Fabric Types):**
- **Fabric Type List:**
  - Table displaying all fabric types
  - Columns: name, description, creation date
- **Add Fabric Type:**
  - Form to add new fabric type
  - Enter name, description
- **Edit Fabric Type:**
  - Update name, description
- **Delete Fabric Type:**
  - Delete unused fabric type

**Materials (Materials):**
- **Material List (MaterialsTable):**
  - Table displaying all materials
  - Columns: name, description, creation date
- **Add Material (MaterialsAddForm):**
  - Form to add new material
  - Enter name, description, color code (write in hex format for mock data display to filter)
- **Edit Material (MaterialsModal):**
  - Modal to edit material
  - Update name, description, color
- **Delete Material:**
  - Delete unused material

**Room Suitabilities (Room Suitabilities):**
- **Room List:**
  - Table displaying room suitabilities (calculated by square meters)
  - Columns: name, description, icon, creation date
- **Add Room (RoomSuitabilitiesAddForm):**
  - Form to add new room
  - Enter name, description
- **Edit Room (RoomsuitabilitiesModal):**
  - Modal to edit room information
  - Update name, description, icon
- **Delete Room:**
  - Delete unused room

### 5. Image Management

**Product Images (Product Images):**
- **Image List:**
  - Table displaying product images
  - Display thumbnail, product name, size, upload date
- **Upload Image:**
  - Form to upload new image
  - Select product to assign image
  - Upload image file (JPG, PNG, WebP)
  - View image preview
- **Delete Image:**
  - Delete product image
  - Confirm before deletion
  - Automatically update on server

**Collection Images (Collection Images):**
- **Collection Image List:**
  - Table displaying collection images
  - Display collection name, thumbnail
- **Upload Image:**
  - Form to upload collection image
  - Select collection
  - Upload image file
- **Delete Image:**
  - Delete collection image

### 6. Order Management

**Order List (Orders):**
- **Order Table (OrdersTable):**
  - Display all orders
  - Columns: order code, customer, email, total price, status, creation date
  - Pagination
  - Filter by status (Pending, Processing, Shipping, Completed, Cancelled)
- **View Order Details (OrdersModal):**
  - Display order details
  - Customer information: name, email, phone, address
  - Product list, quantity, price
  - Total amount, payment method
  - Creation time, expected delivery date
- **Update Order Status:**
  - Change order status
  - Send notification to customer when status updates
  - Status update history

**Payment Methods (Payment Methods):**
- **Payment Method List:**
  - Table displaying payment methods
  - Columns: name, description, status
- **Payment Method Management:**
  - Add new payment method
  - Edit payment method information
  - Enable/disable payment method

**Product Requests (Product Requests):**
- **Request List:**
  - Table displaying product requests from customers
  - Columns: customer name, product, quantity, status, creation date
- **View Request Details:**
  - Customer information
  - Product request details
  - Request description/consultation
- **Update Status:**
  - Change request status
  - Send response to customer

### 7. Data Restore

**Restore Page (Restore Page):**
- **Deleted Product List (RestoreHeader):**
  - Display deleted products (soft deleted)
  - Columns: product name, category, deletion date
  - Search, filter deleted products
- **Restore Product:**
  - Select products to restore
  - Restore one or multiple products at once
  - Confirm before restoration
  - Product returns to normal status
- **Permanent Delete:**
  - Permanently delete deleted product (hard delete)
  - Cannot be restored after permanent deletion

---

## Technologies & Main Dependencies

**Frontend Framework:**
- **Next.js 16.2.6** - React framework with App Router
- **React 19.2.4** - UI library
- **React DOM 19.2.4** - React rendering engine

**State Management & Data Fetching:**
- **Redux Toolkit 2.12.0** - State management library
- **React Redux 9.3.0** - React bindings for Redux
- **Redux Persist 6.0.0** - Persist Redux state to localStorage
- **Axios 1.16.1** - HTTP client for API communication

**UI, Styling & Data Visualization:**
- **Tailwind CSS 3.4.19** - Utility-first CSS framework
- **Recharts 2.10.3** - Charting library for data visualization
- **Lucide React 1.22.0** - Icon library (SVG icons)
- **React Icons 5.6.0** - Additional icon sets

**Build & Development:**
- **ESLint 9** - Code linting
- **ESLint Config (Next.js 16.2.6)** - ESLint configuration for Next.js
- **PostCSS 8.5.15** - CSS transformations
- **Autoprefixer 10.5.2** - Add vendor prefixes to CSS

**Environment & Configuration:**
- **.env.local** - Environment variables
- **next.config.js** - Next.js configuration
- **tailwind.config.js** - Tailwind CSS configuration
- **jsconfig.json** - JavaScript configuration

**Dependencies Overview:**
```json
{
  "@reduxjs/toolkit": "^2.12.0",
  "axios": "^1.16.1",
  "lucide-react": "^1.22.0",
  "next": "16.2.6",
  "react": "19.2.4",
  "react-dom": "19.2.4",
  "react-icons": "^5.6.0",
  "react-redux": "^9.3.0",
  "recharts": "^2.10.3",
  "redux-persist": "^6.0.0"
}
```

**DevDependencies:**
- autoprefixer: ^10.5.2
- eslint: ^9
- eslint-config-next: 16.2.6
- postcss: ^8.5.15
- tailwindcss: ^3.4.19

---

## Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/lytranthienkim/magnula-home
cd magnula-home/admin
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Run Development Server
```bash
npm run dev
```
**Admin will run at: `http://localhost:3002`**

---

## Recommendations

Using libraries that allow initialization of admin dashboard like AdminLTE, etc. will help make management smarter. In the future I will update this file to use admin dashboard table with more intuitive structure.

## License

This project is referenced and has the consent to use data from Magnula furniture brand (https://www.magnula.com).