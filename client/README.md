# FRONTEND (CLIENT)

Frontend for https://magnula.space built with Next.js 16.2.6, React 19.2.4, Redux Toolkit, Motion (Framer Motion) and Tailwind CSS v4. The application provides a smooth furniture shopping experience with interactive animations, multi-criteria product filtering, and real-time order tracking.

---

![Magnula client ui](https://pub-c0d91e27663a41a5a1671bb31cabfb2a.r2.dev/readme/magnula-thumbnail.png)

## Frontend Folder Structure (Folder Structure)

```
client/
├── src/
│   ├── app/                 # Next.js App Router - Routing, Layouts, Pages
│   │   ├── layout.js        # Root layout
│   │   ├── page.jsx         # Home page
│   │   ├── error.js         # Error boundary
│   │   ├── products/        # Products list page
│   │   ├── products/[slug]/ # Product detail page
│   │   ├── about/           # About page
│   │   ├── checkout/        # Checkout page
│   │   ├── order-confirmation/ # Order confirmation page
│   │   └── tracking-order/  # Order tracking page
│   │
│   ├── components/          # UI Components
│   │   ├── common/          # Reusable common components
│   │   │   ├── navigation/  # Header, Navbar, Sidebar, Menu
│   │   │   ├── button/      # Button components (AddToCart, CartActionButton, CloseButton, DecreaseQuantityButton,...)
│   │   │   ├── modal/       # Modal components (Cart Modal, Modal Request Form)
│   │   │   ├── display/     # Display components (Error, Loading)
│   │   │   └── filter/      # Filter components (Color, Category, Price Filter,...)
│   │   ├── layout/          # Layout components
│   │   │   ├── product/     # ProductCard, ProductContainer, ProductCushion, ProductFeature,...
│   │   │   ├── checkout/    # CheckoutForm, CheckoutSummary
│   │   │   ├── home/        # HomeSection
│   │   │   ├── about/       # AboutHero, AboutContent, HomeContent,..
│   │   │   ├── tracking/    # TrackingForm, TrackingOrderDetails
│   │   │   ├── order/       # OrderConfirmationActions, OrderConfirmationDetails
│   │   │   └── preloader/   # PreLoader, PreloaderWrapper
│   │   └── skeleton/        # SkeletonCard, SkeletonCheckout, SkeletonGrid,...
│   │
│   ├── framer/              # Motion (Framer Motion) animation configurations
│   │   ├── loaderVariants.js          # Animation for preloader
│   │   ├── menuScrollVariants.js      # Animation for menu
│   │   └── ... (other motion configs)
│   │
│   ├── redux/               # Global State Management
│   │   ├── store.js         # Redux store configuration
│   │   ├── cartSlice.js     # Cart state (add, remove, update quantity)
│   │   └── userSlice.js     # User information state (checkout form data)
│   │
│   ├── api/                 # Axios instance & API calling functions
│   │   ├── config.js        # Axios base instance, interceptors
│   │   ├── products.js      # Product API endpoints
│   │   ├── order.js         # Order API endpoints
│   │   ├── collections.js   # Collection API endpoints
│   │   ├── category.js      # Category API endpoints
│   │   ├── country.js       # Country/region API
│   │   ├── fabricType.js    # Fabric type options
│   │   ├── materials.js     # Material options
│   │   ├── paymentMethod.js # Payment methods
│   │   └── roomSuitabilities.js # Room suitability options
│   │
│   ├── helper/              # Utility functions & helpers
│   │   ├── slug.js          # Slug generation/parsing
│   │   ├── filter.js        # Filter logic & utilities
│   │   ├── addressValidation.js # Address validation
│   │   └── mapboxGeocoding.js   # Mapbox geocoding integration
│   │
│   ├── styles/              # Styling system
│   │   ├── globals.css      # Global reset, Tailwind directives
│   │   ├── typography.css   # Custom typography, fluid text scaling
│   │   └── component.css    # Reusable component styles
│   │
│   ├── config/              # Configuration
│   │   └── env.js           # Environment variables
│   │
│   ├── constants/           # App constants & configurations
│   │   └── menu.js          # Navigation menu items
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useProduct.js     # Product list & filter logic
│   │   ├── useQueryParams.js # URL query params handling
│   │   ├── useCheckout.js    # Checkout form logic & validation
│   │   └── useCartActions.js # Cart actions (add, remove, update)
│   │
├── public/                  # Static assets
│   ├── common/              # Common assets (logo, icons, etc.)
│   └── fonts/               # Font downloads used
│
├── package.json             # Dependencies & npm scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── next.config.js           # Next.js configuration
└── README.md                # This file
```

---

## Application Architecture - Clean Architecture

### `src/app/` - Next.js App Router
Manages routing and layout of the application using Next.js 16 App Router:
- **Home**: Home page
- **Products**: Product list page
- **Product Detail**: View product details, images, materials, fabrics, sizes, room suitability, price, etc.
- **Checkout**: Form for customer information, shipping address, payment method selection
- **Order Confirmation**: Display newly created order information
- **Order Tracking**: Enter order code to view shipping status

### `src/components/` - Reusable UI Components
Reusable components organized by functionality:

**common/** - Reusable common components:
- **navigation/**: Navbar, Footer, MobileMenu, PaginationControl
- **button/**: AddToCartButton, CartActionButton, CloseButton, DecreaseQuantityButton, IncreaseQuantityButton, RemoveCartButton, RequestButton
- **modal/**: CartModal (quick cart), RequestForm (order request)
- **display/**: Error, Loading (status display)
- **filter/**: CategoryList, ColorOptions, CustomSelectField, Filter, FilterControls, FilterDropdown, PriceFilter

**layout/** - Layout components for each page:
- **product/**: ProductCard, ProductContainer, ProductCushion, ProductFeature, ProductItem, ProductSimilar
- **checkout/**: CheckoutForm, CheckoutSummary
- **home/**: HomeSection
- **about/**: AboutHero, AboutContent, HomeContent01, HomeContent02, HomeContent03
- **tracking/**: TrackingForm
- **order/**: OrderConfirmationActions, OrderConfirmationDetails
- **preloader/**: Loader, PreloaderWrapper

**skeleton/** - Loading placeholders: SkeletonCard, SkeletonCheckout, SkeletonCircle, SkeletonGrid, SkeletonImage, SkeletonOrderConfirmation, SkeletonProductItem, SkeletonText, SkeletonTrackingOrder

### `src/framer/` - Motion & Animation Configurations
Manages all animations using Motion (Framer Motion):
- **loaderVariants.js**: Animation for preloader
- **menuVariants.js, menuScrollVariants.js**: Animation for navigation menu
- **productContainerMotion.js**: Animation for product grid container
- **productItemMotion.js**: Animation for product item cards
- **productCushionMotion.js**: Animation for product cushion section
- **productFeatureMotion.js**: Animation for product feature section
- **productSimilarMotion.js**: Animation for similar products section
- **trackingOrderMotion.js**: Animation for order tracking page

### `src/redux/` - Global State Management
Manages global state using Redux Toolkit:
- **store.js**: Redux store configuration
- **cartSlice.js**: Cart state (add, remove, update quantity of products)
- **userSlice.js**: User information state (checkout form data)

### `src/api/` - API & Data Fetching
API client configuration and endpoint functions:
- **config.js**: Axios base instance, interceptors, authentication headers
- **products.js**: Product API endpoints (getProducts, getProductById, search)
- **order.js**: Order API endpoints (createOrder, getOrderByCode, trackOrder)
- **collections.js**: Collection API endpoints
- **category.js**: Category API endpoints
- **country.js**: Country/region API endpoints
- **fabricType.js**: Fabric type options
- **materials.js**: Material options
- **paymentMethod.js**: Payment methods
- **roomSuitabilities.js**: Room suitability options

### `src/helper/` - Utility Functions
Helper functions for handling common logic:
- **slug.js**: Slug generation/parsing for products
- **filter.js**: Product filtering logic & utilities
- **addressValidation.js**: Address validation & formatting
- **mapboxGeocoding.js**: Mapbox geocoding integration

### `src/hooks/` - Custom React Hooks
Custom hooks for managing component logic:
- **useProduct.js**: Product list & filtering logic
- **useQueryParams.js**: URL query parameters handling & state sync
- **useCheckout.js**: Checkout form logic & validation
- **useCartActions.js**: Cart actions (add, remove, update)

### `src/config/` - Configuration
- **env.js**: Environment variables setup

### `src/styles/` - Styling System
- **globals.css**: Import Tailwind CSS, reset global styles
- **typography.css**: Standard typography system, fluid text scaling
- **component.css**: Reusable component styles

---

## UI/UX & Motion Features Highlights

### 1. Refined Preloading Experience
The loading screen (Preloader) is designed with Magnula branding, displayed on first user visit:
- **Preloader Animation**: Smooth loader animation with Motion (loaderVariants) - displays Magnula logo, title, and brand message
- **Brand Message**: Marketing message "Designed with purpose" and brand story
- **Auto Close**: Automatically closes after 4 seconds
- **Save State**: Saves view state to sessionStorage to prevent displaying again on next visit
- **Fixed Positioning**: Full-screen display on top layer (z-50)

### 2. Fluid Typography System & Responsive Design
Uses custom typography system in `typography.css` with CSS clamp() for fluid scaling:
- **Fluid Text Scaling**: Font size automatically adjusts based on viewport width (from mobile 320px to desktop 2560px)
  - h1: clamp(32px, 2vw, 56px)
  - h2: clamp(24px, 2vw, 32px)
  - h3: clamp(20px, 2vw, 24px)
  - body-01: clamp(14px, 1vw, 18px)
  - body-02: clamp(14px, 1vw, 16px)
  - body-03: clamp(12px, 1vw, 14px)
- **Custom Fonts**: Uses custom fonts "The Seasons Italic" and "TheSeasonsBold" for decorative typography
- **Tailwind CSS v4**: Combines utility classes for responsive layout and styling

### 3. Motion Animations
Deep integration of Motion (Motion v12.40.0) for smooth experience:
- **Preloader Animation** (loaderVariants.js): Title fade-in, subtitle slide-up, body text fade-in with stagger timing
- **Modal Cart Animation**: 
  - Backdrop overlay fade (opacity: 0 → 1)
  - Modal slide-in from right (x: 100% → 0) with easeIn transition
  - AnimatePresence manages enter/exit animation
- **Product List Stagger** (productContainerMotion.js): 
  - Container opacity fade-in
  - Product cards stagger animation (0.08s delay between each card)
  - Card spring physics animation (spring stiffness: 60, damping: 15)
- **Menu Animations** (HomeSection): 
  - Menu items fade-in + slide-up (y: 10 → 0) with stagger delay
  - Clip-path expansion animation for hero background (from 44% inset to 0%)
  - Custom cubic-bezier easing for smooth motion
- **Hover Interactions**: Smooth transitions on interactive elements (buttons, links) with 300ms-500ms easing

---

## State Management & Data Fetching

### Redux Toolkit + Redux Persist
Manages application state with Redux Toolkit:

**Cart State Management** (cartSlice.js):
```javascript
// Add product to cart (auto-increment quantity if product already exists)
dispatch(addToCart(newItem))

// Remove product from cart
dispatch(removeFromCart(productId))

// Increase product quantity (checks stock limit)
dispatch(increaseQuantity({ id, stock }))

// Decrease product quantity
dispatch(decreaseQuantity(productId))

// Clear entire cart
dispatch(clearCart())
```

**User State Management** (userSlice.js):
```javascript
// Save user information (from checkout form or login)
dispatch(setUser(userData))

// Update user information
dispatch(updateUser(updateData))

// Delete user information
dispatch(clearUser())
```

**Redux Persist Configuration**:
- **Storage**: localStorage for persistent state storage
- **Whitelist**: Automatically saves both `cart` and `user` state to localStorage
- **PersistGate**: Wraps Redux Provider for state sync and recovery
- **Auto Recovery**: Cart and user info are automatically recovered when:
  - App reloads/refreshes
  - User returns to browser after closing
  - Switching between tabs in same domain
  - Ensures cart data is not lost when browser closes

### Axios API Client
API client configuration:
```javascript
// src/api/config.js
import { config } from '@/config/env';

export const API = axios.create({
  baseURL: config.apiUrl, // from NEXT_PUBLIC_API_URL env var
  withCredentials: true    // allow sending cookies with requests
});
```

**Environment Configuration** (src/config/env.js):
```javascript
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  siteUrl: process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000',
  countryApiKey: process.env.NEXT_PUBLIC_COUNTRY_API_KEY,
  mapboxToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
};
```

**API Endpoints** organized by feature:

**Product Management** (products.js):
- `getAllProducts(queryParams)` - Get product list with filter, sort, pagination support
- `getProductItem(id)` - Get single product details by ID

**Order Management** (order.js):
- `createOrder(orderData)` - Create new order
- `getOrderById(orderId)` - Get order details by ID
- `getOrderByOrderCode(orderCode)` - Track order by order code (public endpoint)
- `getOrderItemByOrderId(orderId)` - Get list of items in order
- `createProductRequest(requestData)` - Send order/consultation request for out-of-stock products

**Collections & Categories** (collections.js, category.js):
- `getAllCollection()` - Get list of product collections
- `getAllCategories()` - Get list of product categories

**Filter Options** (fabricType.js, materials.js, roomSuitabilities.js):
- `getAllFabricTypes()` - Get list of fabric types (filter option)
- `getAllMaterials()` - Get list of materials (filter option)
- `getAllRoomSuitabilities()` - Get list of suitable rooms (filter option)

**Payment Methods** (paymentMethod.js):
- `getAllPaymentMethods()` - Get list of payment methods

**Address Management** (country.js - uses Country State City API):
- `getAllCountries()` - Get list of countries from REST API
- `getAllStateByCountry(countryCode)` - Get list of states/provinces by country

---

## Features Showcase - Feature Details

### 1. Product Filtering (Advanced Filtering System)

Users can filter products by multiple criteria simultaneously through the Filter component:

**Filter Criteria:**
- **Category**: Select product type - list loaded from backend
- **Color**: Filter by product color
- **Fabric Type**: Filter by fabric type
- **Material**: Filter by finished material
- **Room Suitability**: Filter by suitable room
- **Price Range**: Dual input fields for min/max price

**Validation & Behaviors**:
- **Price Validation**: 
  - Must be positive number (no negative)
  - No leading zeros
  - Max price >= Min price
  - Error messages display in real-time
- **Toggle Filter Panel**: Button to open/close filter panel (mobile responsive)
- **Clear Filter Button**: Clear all filter selections
- **Click Outside to Close**: Filter panel closes when clicked outside

### 2. Product Detail & Collection Page (Product Detail & Collection)

When clicking a product, users view the ProductItem page with:

**Image Gallery:**
- **Image Library**: Main image + thumbnails below
- **Click Thumbnail**: Switch image when clicking thumbnail
- **Image Lazy Loading**: Uses Next.js Image component with optimization

**Product Information:**
- **Product Name** (productName)
- **Collection Description** (Collection.description) - collection info
- **Product Price** (from first variant)
- **Stock** (stockQuantity from variant)

**Detailed Information (from Variants):**
- **Overall Size** (overallSize)
- **Seat Size** (seatSize)
- **Fabric Type** (FabricType.description)
- **Material** (Material description)

**Related Suggestions:**
- **ProductSimilar Component**: Get products from same collection (collectionId)
- **Horizontal Scroll**: Horizontal scrolling list with Motion animation
- **Click Product**: Navigate to product detail page

**Action Buttons:**
- **Add to Cart Button**: Add to cart (checks stock limit)
- **Request Button**: Open RequestForm modal to send request

### 3. Quick Cart Modal (Interactive Cart Modal)

CartModal component - pop-up overlay with animation:

**Interface:**
- **Backdrop Overlay**: Fade-in animation, click to close
- **Modal Slide-in**: Slide from right (x: 100% → 0) with easeIn transition
- **Header**: "Cart" title + Close button

**Product List:**
- **Display**: Image, name, price, quantity of each item
- **Subtotal**: Calculated in real-time (quantity × price)

**Quantity Adjustment:**
- **Increase Button**: Increase quantity (checks stock limit)
- **Decrease Button**: Decrease quantity (minimum 1)
- **Remove Button**: Remove item from cart

**Price Calculation:**
- **Total**: Updates in real-time when quantity changes
- **Memoized Subtotal**: Optimize performance

**Action Buttons:**
- **Continue Shopping**: Close modal, return to browsing
- **Checkout**: Close modal, navigate to `/checkout`

**Body Scroll Lock**: Disable body scroll when modal is open

### 4. Custom Order/Consultation Request Form (Custom Request Form)

RequestForm modal - send product request:

**Form Fields:**
- **Customer Name** (customerName) - required
- **Phone Number** (customerPhone) - required
- **Requested Quantity** (requestedQuantity) - minimum 1
- **Request Description** (description) - optional

**Validation:**
- Full name validation (not empty)
- Phone number validation (not empty)
- Quantity validation (>= 1)
- Real-time error clearing when user edits

**Submit & Feedback:**
- **Loading State**: "Submitting..." message when sending
- **Success**: Display success message, auto-close modal
- **Error**: Display error message, allow retry
- **API Call**: `createProductRequest()` API

**Animation:**
- Modal fade-in/out with AnimatePresence
- Form fields smooth transition

### 5. Order Tracking System (Order Tracking)

TrackingOrderPage - public tracking page:

**Tracking Form:**
- **Order Code Input**: Enter order code (placeholder: "e.g., ORD-2026-06-25-ABC123")
- **Track Button**: Submit form, loading state when tracking
- **Error Display**: Display error message if order code not found

**Result Display:**
- **When order exists**: Display TrackingOrderDetails component
- **Loading state**: SkeletonTrackingOrder placeholder
- **Not found**: Error message "Order code not found..."

**Display Data:**
- **Order Information**: From `getOrderByOrderCode()` API
- **Items List**: From `getOrderItemByOrderId()` API
- **Order Status**: Status (Pending, Processing, Shipping, Completed, Cancelled)

**Animation:**
- Header title fade-in
- Header description slide-up
- Form container fade-in
- Details container fade-in (when order exists)
- Motion variants from `trackingOrderMotion.js`

### 6. Checkout Page (Checkout Flow)

CheckoutPage - multi-step checkout form:

**Form Fields:**
- **Customer Name** (customerName)
- **Email** (customerEmail) - email validation
- **Phone Number** (customerPhone)
- **Country/Region** (countryRegion) - select dropdown
- **State/Province** (stateProvince) - select dropdown (conditional based on country)
- **Shipping Address** (shippingAddress) - text input
- **Payment Method** (paymentMethodId) - select dropdown

**Address Features:**
- **Address Validation**: Check address format using `validateShippingAddress()`
- **Mapbox Address Suggestions**: Address autocomplete from Mapbox API
- **Country/State Selection**: Dropdown lists (disabled if country not selected)

**Country/State Integration:**
- **Load Countries**: `getAllCountries()` from Country State City API
- **Load States**: `getAllStateByCountry(countryCode)` conditional
- **Custom Select Field**: Reusable dropdown component

**Payment Methods:**
- **Load Payment Methods**: `getAllPaymentMethods()` API
- **Dropdown Selection**: Select payment method

**Order Summary:**
- **CheckoutSummary Component**: Display items, quantities, total price
- **Real-time Updates**: Update when cart changes

**Form Validation:**
- **Error Handling**: Display error messages for each field
- **Submit Validation**: Check all required fields before submit
- **Error State**: Clear errors when user edits

**Order Creation:**
- **Submit Form**: Call `createOrder()` API
- **Redirect**: Navigate to `/order-confirmation` after success
- **Redux State**: Save user info to Redux (userSlice) during checkout

**Skeleton Loading:**
- **SkeletonCheckout**: Placeholder loading state

---

## Key Technologies & Dependencies

**Frontend Framework:**
- **Next.js 16.2.6** - React framework with App Router, server-side rendering, static generation
- **React 19.2.4** - UI library
- **React DOM 19.2.4** - React rendering engine

**State Management & Data Fetching:**
- **Redux Toolkit 2.12.0** - State management library
- **React Redux 9.3.0** - React bindings for Redux
- **Redux Persist 6.0.0** - Persist Redux state to localStorage
- **Axios 1.16.1** - HTTP client for API communication

**UI, Styling & Animation:**
- **Tailwind CSS v4** - Utility-first CSS framework (postcss 4)
- **Motion 12.40.0** - Animation library (rebrand of Framer Motion)
  - Used for page transitions, component animations, hover effects
- **Lucide React 1.16.0** - Icon library (SVG icons)
- **React Icons 5.6.0** - Additional icon sets (AiOutlineClose, etc.)
- **Recharts 3.8.1** - Charting library for visualizations

**Utilities & Helpers:**
- **React Number Format 5.4.5** - Format numbers, prices, phone numbers in input fields
- **Custom Hooks** - useProduct, useQueryParams, useCheckout, useCartActions

**Build & Development:**
- **ESLint 9** - Code linting (finds bugs, enforces code style)
- **ESLint Config (Next.js 16.2.6)** - ESLint configuration for Next.js

**Environment & Configuration:**
- **.env.local** - Environment variables (NEXT_PUBLIC_API_URL, etc.)
- **next.config.js** - Next.js configuration
- **tailwind.config.js** - Tailwind CSS configuration
- **postcss.config.js** - PostCSS configuration

**Dependencies Overview:**
```json
{
  "@reduxjs/toolkit": "^2.12.0",
  "axios": "^1.16.1",
  "lucide-react": "^1.16.0",
  "motion": "^12.40.0",
  "next": "16.2.6",
  "react": "19.2.4",
  "react-dom": "19.2.4",
  "react-icons": "^5.6.0",
  "react-number-format": "^5.4.5",
  "react-redux": "^9.3.0",
  "recharts": "^3.8.1",
  "redux-persist": "^6.0.0"
}
```

**DevDependencies:**
- @tailwindcss/postcss: ^4
- eslint: ^9
- eslint-config-next: 16.2.6
- tailwindcss: ^4

---

## Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/lytranthienkim/magnula-home
cd magnula-home/client
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
**Client will run at: `http://localhost:3000`**

---

## License

This project is based on and has permission to use data from the Magnula furniture brand (https://www.magnula.com).
