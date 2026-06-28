# MAGNULA Home - Furniture E-Commerce Platform

MAGNULA is a comprehensive furniture e-commerce platform designed with a modern, scalable architecture. The system provides customers with an intuitive shopping experience and administrators with powerful management tools.

## Project Structure

```
magnula-home/
├── client/           # Next.js customer-facing application (Port 3000)
├── server/           # Express.js REST API backend (Port 5000)
└── admin/            # Next.js admin dashboard (Port 3001)
```

All three applications work together to provide a complete e-commerce solution with clear separation of concerns.

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
- Redis for caching and session management
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
- Product search with real-time results
- Dynamic product grid layout with responsive sizing
- Skeleton loaders for smooth loading experience
- Product variants support (size, color, specifications)

#### Shopping Cart Management
- Redux-based cart state management
- Add/remove products from cart
- Quantity adjustment
- Real-time cart total calculation
- Cart persistence across sessions
- Cart clearing after successful order

#### Checkout Process
- Multi-step checkout form with validation
- Shipping information collection
- Payment method selection
- Order summary display
- Stock validation before order confirmation
- Order creation with automatic cart clearing
- Comprehensive error handling with user-friendly messages

#### Order Management
- Order confirmation page with detailed information
- Order tracking by order code
- Order status display
- Order items listing with product details
- Order history tracking
- Real-time order status updates

### Admin Dashboard Features

#### Product Management
- Full CRUD operations for products
- Product variant management
- Stock management
- Category assignment
- Collection assignment
- Bulk actions support
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
- Bulk attribute operations
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
- Real-time stock tracking
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

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm package manager
- MySQL 8.0+ database instance
- Git version control

### Installation

1. Clone the repository
```bash
git clone https://github.com/lytranthienkim/magnula-home.git
cd magnula-home
```

2. Install dependencies for each application
```bash
# Client application
cd client
npm install
cd ..

# Admin application
cd admin
npm install
cd ..

# Server application
cd server
npm install
cd ..
```

3. Configure environment variables

Create .env files in each directory with required configuration:

server/.env
```
NODE_ENV=development
PORT=5000
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=magnula_db
DATABASE_USER=root
DATABASE_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
REDIS_HOST=localhost
REDIS_PORT=6379
```

client/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=MAGNULA
```

admin/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=MAGNULA Admin
```

4. Start all applications

Terminal 1 - Start the backend server:
```bash
cd server
npm run dev
```

Terminal 2 - Start the customer client:
```bash
cd client
npm run dev
```

Terminal 3 - Start the admin dashboard:
```bash
cd admin
npm run dev
```

Application URLs:
- Customer Client: http://localhost:3000
- Admin Dashboard: http://localhost:3001
- API Server: http://localhost:5000/api
- API Documentation: http://localhost:5000/api/docs

## Architecture & Code Patterns

### Component Extraction Pattern (Logic-UI Separation)

The codebase implements a strict separation of concerns by extracting business logic into custom hooks while keeping components focused on presentation.

Architecture Layers:

1. Custom Hooks Layer (`src/hooks/`)
   - Contains all state management and API interactions
   - Handles data fetching with useEffect
   - Manages complex business logic
   - Provides handler functions for user interactions
   - Returns only necessary data and functions to consumers

2. Component Layer (`src/components/`)
   - Pure presentation components
   - Receive data via props only
   - No direct API calls or state management
   - Focused on rendering UI
   - Reusable across multiple pages

3. Page Layer (`src/app/`)
   - Minimal orchestration files (30-50 lines)
   - Import hooks for logic
   - Import components for UI
   - Compose hooks and components together
   - Handle page-level layouts

Implementation Example:
```javascript
// hooks/useProduct.js - Business Logic
export const useProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const handleFilter = async (criteria) => {
    setLoading(true);
    const results = await fetchFiltered(criteria);
    setProducts(results);
    setLoading(false);
  };
  
  return { products, loading, handleFilter };
};

// components/ProductList.jsx - Presentation Only
export const ProductList = ({ products, loading, onFilter }) => {
  return (
    <div>
      {loading ? <Spinner /> : products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
};

// app/products/page.jsx - Composition
export default function ProductsPage() {
  const { products, loading, handleFilter } = useProduct();
  return <ProductList products={products} loading={loading} onFilter={handleFilter} />;
}
```

Benefits of This Pattern:
- Logic is reusable across multiple pages
- Components are easier to test and maintain
- Clear separation of concerns
- Pages remain lean and focused
- Logic can be tested independently from UI

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

## API Documentation

Comprehensive API documentation including all endpoints, request/response formats, and authentication requirements is maintained in the server directory.

Access API documentation at: `server/API_DOCUMENTATION.md`

Key API Areas:
- Authentication endpoints (login, register, token refresh)
- Product catalog endpoints (search, filter, retrieve)
- Order management endpoints (create, retrieve, track)
- User management endpoints (profile, preferences)
- Admin endpoints (CRUD operations with role validation)

## Development Workflows

### Adding a New Feature

1. Identify if feature requires complex state or API interactions
2. Create custom hook in `src/hooks/useFeatureName.js` with all logic
3. Create UI components in `src/components/layout/feature/`
4. Create or update page file in `src/app/feature/page.jsx`
5. Import and compose hook with components in page
6. Test hook logic independently from components
7. Test component presentation in isolation
8. Test integrated page functionality

### Modifying Existing Features

1. Check if logic is in custom hook or component
2. If logic is in hook, modify hook without touching component files
3. If logic is in component, extract to hook first
4. Update components to use extracted logic
5. Verify no regression in dependent pages

## Recent Updates

Version 1.0 - June 28, 2026

Architecture Improvements:
- Extracted useProduct hook from ProductContainer component
- Extracted useCheckout hook from checkout page
- Extracted useOrderConfirmation hook from order-confirmation page
- Extracted useTrackingOrder hook from tracking-order page
- Established consistent hook-based architecture across codebase

Infrastructure:
- Added comprehensive .gitignore for monorepo structure
- Configured GitHub repository for version control
- Implemented proper environment variable management

## Build and Deployment

Production Build:
```bash
# Client
cd client && npm run build

# Admin
cd admin && npm run build

# Server
cd server && npm run build
```

Deployment Platforms:
- Client: Vercel, Netlify, or Docker container
- Admin: Vercel, Netlify, or Docker container
- Server: Railway, Heroku, AWS EC2, or Docker container

## Contributing Guidelines

Contribution Process:
1. Create feature branch from main: `git checkout -b feature/feature-name`
2. Implement changes following existing patterns
3. Follow component extraction pattern for complex logic
4. Commit with descriptive messages: `git commit -m "feature: add new feature description"`
5. Push to repository: `git push origin feature/feature-name`
6. Create Pull Request with detailed description of changes

Code Standards:
- Use consistent naming conventions
- Follow existing code style
- Extract logic to hooks when component becomes complex
- Add comments for non-obvious logic
- Test features before submitting PR

## Support and Contact

For technical inquiries, bug reports, or feature requests:
Email: thienkimly2601@gmail.com
Repository: https://github.com/lytranthienkim/magnula-home

---

Last Updated: June 28, 2026
Project Status: Active Development
Version: 1.0
