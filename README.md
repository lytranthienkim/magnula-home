# MAGNULA FURNITURE

MAGNULA is an online shopping website specializing in premium sofas and cushions, designed to showcase products and provide users with a seamless, effortless purchasing experience. The interface and user experience are directly inspired by the minimalist and refined design language of the brand MAGNULA (https://www.magnula.com/).

## Project Structure

```
magnula-home/
├── client/           # Next.js customer-facing application (Port 3000)
├── server/           # Express.js REST API backend (Port 5000)
└── admin/            # Next.js admin dashboard (Port 3001)
```

## Technology Stack

### Frontend (Client & Admin)
- Next.js 14 with App Router for modern React development
- React 18 for component management
- Tailwind CSS for utility-first styling
- Framer Motion for smooth animations and transitions
- Redux Toolkit for predictable state management
- Custom hooks architecture for logic reusability

### Backend (Server)
- Node.js runtime environment
- Express.js for HTTP server and routing
- MySQL for relational data storage
- JWT (JSON Web Tokens) for authentication
- Railway for cloud deployment

## Features & Functionality

### Customer-Facing Features

#### Product Discovery and Filtering
- Advanced product filtering by multiple criteria:
  - Category selection
  - Color filtering with hex value matching
  - Price range selection (dynamic min/max calculation)
  - Fabric type filtering
  - Material filtering
  - Room suitability filtering
- Dynamic product grid layout with responsive sizing
- Skeleton loaders for smooth loading experience
- Product variants support (size, color, specifications)

#### Shopping Cart Management
- Redux-based cart state management
- Add/remove products from cart
- Quantity adjustment
- Cart total calculation
- Cart persistence across sessions
- Cart clearing after successful order

#### Checkout Process
- Multi-step checkout form with validation
- Shipping information collection
- Payment method selection
- Order summary display
- Stock validation before order confirmation
- Order creation with automatic cart clearing

#### Order Management
- Order confirmation page with detailed information
- Order tracking by order code
- Order status display
- Order items listing with product details
- Order history tracking
- Order status updates

### Admin Dashboard Features

#### Product Management
- Full CRUD operations for products
- Product variant management
- Stock management
- Category assignment
- Collection assignment
- Advanced filtering and sorting
- Soft delete functionality for data retention

#### Order Management
- Order listing with status tracking
- Order details view with customer information
- Order item management
- Status update capabilities
- Payment information display
- Shipping details management
- Order search and filtering

#### User Management
- User listing and search
- User profile viewing
- User status management (active/inactive)
- Role assignment
- User deactivation without permanent deletion
- User activity tracking

#### Role-Based Access Control (RBAC)
- Role creation and management
- Permission assignment to roles
- Fine-grained access control
- Role hierarchy support
- Permission validation at API level

#### Collection Management
- Collection CRUD operations
- Product association with collections
- Collection soft delete
- Image management for collections

#### Attribute Management
- Fabric type management (create, update, delete)
- Material management
- Room suitability management
- Attribute usage tracking

### Backend API Features

#### Authentication & Authorization
- User registration and login
- JWT token generation and validation
- Token refresh mechanism
- Role-based endpoint protection
- Permission-based access control

#### Order Processing
- Order creation with validation
- Stock verification before order confirmation
- Order status workflow management
- Order item tracking
- Payment processing integration
- Order confirmation email sending

#### Inventory Management
- Stock tracking
- Stock deduction on order placement
- Stock restoration on order cancellation
- Low stock alerts
- Inventory history tracking

#### Data Management
- Soft delete implementation for data recovery
- Transaction support for data consistency
- Data caching for performance optimization
- Bulk operations support

## Core Business Logic

### Soft Delete Implementation

MAGNULA implements soft delete functionality across most data entities to ensure data integrity and enable audit trails. Rather than permanently removing records, soft-deleted items are marked with a deletion timestamp and filtered from active queries.

Implementation Details:
- All table structures include `isActive` boolean field and `deletedAt` timestamp field
- Soft-deleted records are excluded from standard query results by default
- Admin dashboard provides restore functionality to recover deleted items
- Soft-deleted data is preserved for compliance and audit purposes
- Archive/Restore operations are logged with timestamps and user information

Affected Entities:
- Products (can be restored to active inventory)
- Collections (can be restored for future use)
- Categories (can be restored to product assignments)
- Users (can be deactivated and reactivated)
- Orders (preserved in system for audit trail)
- Roles (can be archived without affecting historical role assignments)

### Order Processing Logic

The order processing workflow follows this sequence:

1. **Order Initiation**: Customer submits order with cart items and shipping details
2. **Stock Validation**: System verifies all items are in stock at specified quantities
3. **Stock Deduction**: Available stock is reduced by ordered quantity
4. **Order Creation**: Order record is created with status "PENDING"
5. **Payment Processing**: Payment method is processed (integration-dependent)
6. **Order Confirmation**: Upon successful payment, order status changes to "CONFIRMED"
7. **Fulfillment**: Admin updates order status through fulfillment stages
8. **Delivery**: Order status progresses to "DELIVERED"
9. **Archive**: Completed orders remain in system for historical records

Error Handling:
- Insufficient stock triggers order failure with detailed error message
- Payment failures allow order cancellation and stock restoration
- Order cancellations automatically restore stock quantities
- All state changes are logged with timestamps

### Role-Based Access Control (RBAC) Flow

Permission Structure:
- System permissions are granular (create, read, update, delete, restore)
- Permissions are grouped by feature (products, orders, users, etc.)
- Roles combine multiple permissions for common user types
- Permissions are validated at API endpoint level

Standard Roles:
- Administrator: Full system access with all permissions
- Manager: Content and order management permissions
- Staff: Limited permissions for basic operations
- Customer: Public access limited to browsing and ordering

### Product Filtering Architecture

The product filtering system uses query parameter-based state management:

Query Parameters:
- `category`: Product category selection
- `color`: Collection color hex value
- `minPrice` / `maxPrice`: Price range filter
- `fabricTypeName`: Material composition filter
- `materialName`: Specific material type
- `roomSuitabilityName`: Intended room usage

Logic Flow:
1. User selects filter criteria
2. Query parameters are updated in URL
3. Product list is fetched with filter parameters
4. Results are displayed dynamically
5. Filter state persists in URL for bookmarking

Performance Optimization:
- Filter options are cached server-side
- Price limits are calculated from available inventory
- Search results are paginated for large datasets
- API responses include aggregated data for filter options

### Implemented Hooks

Current hook implementations in the codebase:

useProduct
- Manages product listing and filtering
- Handles query parameter state
- Fetches filter options (colors, materials, fabric types)
- Implements price range calculation
- Manages product search results

useCheckout
- Manages checkout form state
- Handles cart retrieval from Redux
- Calculates order total
- Processes order creation
- Handles payment integration
- Manages cart clearing and redirect

useOrderConfirmation
- Fetches order details by ID
- Manages loading and error states
- Displays confirmation information

useTrackingOrder
- Manages order tracking form
- Fetches order by tracking code
- Retrieves associated order items
- Handles tracking result display

## Database Schema Overview

### User Management Tables
- `users`: Customer and admin user profiles with authentication
- `roles`: Role definitions for access control
- `permissions`: Fine-grained permission definitions
- `role_permissions`: Junction table linking roles to permissions

### Product Catalog Tables
- `products`: Core product information and metadata
- `product_variants`: Size and color variants with individual pricing
- `collections`: Furniture collections grouping products
- `categories`: Product categories for organization
- `fabric_types`: Fabric material specifications
- `materials`: Material composition options
- `room_suitabilities`: Intended room usage classifications

### Commerce Tables
- `orders`: Customer order records with status tracking
- `order_items`: Individual items within orders
- `carts`: Temporary shopping cart storage

### Supporting Tables
- `countries`: Shipping destination countries
- `payment_methods`: Available payment options
- `product_images`: Product image storage and retrieval

All main tables include soft delete support via `isActive` boolean and `deletedAt` timestamp.