# MAGNULA FURNITURE ONLINE SHOP

Magnula Furniture Online Shop is built based on Magnula Furniture brand - a furniture brand specializing in premium furniture chair products for families launched in Indore, India in 2025 (original website at https://www.magnula.com). Magnula Furniture Online Shop uses the domain https://magnula.space with improvements including added product purchase and sales functionality, order inquiry and tracking, product order request submission to sellers, and enhanced website interface. The prerequisite when building Magnula Furniture Online is to provide users with an intuitive and modern product purchasing experience while maintaining the authentic brand identity of Magnula.

---

![Magnula video](https://pub-c0d91e27663a41a5a1671bb31cabfb2a.r2.dev/readme/vide-magnula-demo.GIF)

## Project Architecture

Magnula Furniture Online Shop is divided into three main modules:
```
magnula-home/
├── client/          # Frontend Storefront for customers (Next.js App Router)
├── server/          # Backend RESTful API Server & Database (Node.js & Express)
└── admin/           # Dashboard Management for staff & administrators (Next.js)
```

---

## Technologies Used

### Backend (Server)

- Runtime: Node.js (ES Modules)
- Framework: Express 5.2.1
- Database: MySQL 8.0+ (MySQL2 driver)
- ORM: Sequelize 6.35.0
- In-Memory Cache: Redis 4.6.13
- Authentication: JWT (JSON Web Tokens)
- Password Hashing: bcryptjs
- Security & Utilities: cookie-parser, cors, dotenv
- File Upload & Storage: Multer + Cloudflare R2 (S3-compatible API via @aws-sdk/client-s3)
- Development: Nodemon

### Frontend (Client)
- Framework: Next.js 16.2.6 (App Router)
- Library: React 19.2.4 & React DOM 19.2.4
- State Management: Redux Toolkit 2.12.0 & React Redux 9.3.0
- State Persistence: Redux Persist 6.0.0
- Styling: Tailwind CSS v4 & PostCSS
- Animations: Motion 12.40.0 (Framer Motion)
- HTTP Client: Axios 1.16.1
- Icons: Lucide React 1.16.0 & React Icons 5.6.0
- Data Visualization: Recharts 3.8.1
- Formats & Input: React Number Format 5.4.5
- Code Quality: ESLint 9

### Admin Dashboard

- Framework: Next.js 16.2.6 (App Router)
- Library: React 19.2.4 & React DOM 19.2.4
- State Management: Redux Toolkit 2.12.0 & React Redux 9.3.0
- State Persistence: Redux Persist 6.0.0
- Styling: Tailwind CSS 3.4.19, PostCSS 8.5.15 & Autoprefixer 10.5.2
- HTTP Client: Axios 1.16.1
- Icons: Lucide React 1.22.0 & React Icons 5.6.0
- Data Visualization & Analytics: Recharts 2.10.3
- Code Quality: ESLint 9

---

## Module Overview

### Backend (Server)

- Routing & REST APIs.
- Authentication & User Management: Login, issue/refresh JWT Tokens, manage account information and user permissions (RBAC).
- CRUD Products, variants (Size, Price, Stock Quantity), fabric types (Fabric), materials (Material) and collections (Collections), collection images, product display images.
- Handle order processing flow, update order status, calculate totals and automatically synchronize/deduct stock quantity.
- Receive and manage product restock/custom consultation requests (Restock/Quantity Request) from customers.
- API receives and processes image uploads directly to Cloudflare R2 storage system.

### Available Scripts

- Start production server: npm start
- Start development server: npm run dev
- Seed database records: npm run seed

### Frontend (Client)

User Interface for customers:
- Preloading screen for first-time access.
- Home page, about page, product introduction page and product detail pages, order tracking page, cart modal when purchasing.
- Product filter by color, fabric material, finish material, room suitability classification, and price range (min price/max price).
- View product list, images, detailed product information and related collections, prices for each product.
- Modal to send product order requests to the seller.
- Cart modal displaying quantity of products added, product images, and prices corresponding to quantities.
- Track orders through order tracking feature.

### Available Scripts

- Start development server: npm run dev
- Start production server: npm run start

![Magnula client ui](https://pub-c0d91e27663a41a5a1671bb31cabfb2a.r2.dev/readme/magnula-ui.png)

### Admin Dashboard

Administration interface for staff and managers:
- Manage Products, Variants (Size, Price, Stock Quantity), Collections, Fabric Types, Materials and collection images, product images.
- Manage and update order processing workflow (Received -> Packing -> Shipping -> Completed) and update stock quantities.
- Manage customer list, employee list and configure roles / system access permissions.
- Manage and receive product restock/custom consultation request forms (Restock/Quantity Requests) from customers.
- Overview dashboard displaying revenue metrics, order quantities and real-time inventory reports.
- Manage payment method configurations.
- Manage recovery process for soft-deleted data.

### Available Scripts

- Start development server: npm run dev
- Start production server: npm run start

![Magnula admin ui](https://pub-c0d91e27663a41a5a1671bb31cabfb2a.r2.dev/readme/magnula-admin-ui.png)

---

## Getting Started

### Requirements
- Node.js v18.0.0 or higher
- Package manager: npm, yarn or pnpm
- Database: MySQL 8.0+
- Cache: Redis 6.0+ (Optional, used for Caching)
- Cloud Storage: Cloudflare account with Cloudflare R2 service enabled

### Step 1: Clone Repository

```bash
git clone https://github.com/lytranthienkim/magnula-home
cd magnula-home
```

### Step 2: Install Dependencies

Install for all modules:

```bash
# Install for server
cd server
npm install

# Install for client
cd client
npm install

# Install for admin
cd admin
npm install
```

### Step 3: Set Up Environment Variables

Create .env (or .env.local) file in each directory:

#### server/.env
```
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=magnula_home
DB_PORT=3306
JWT_SECRET=
JWT_EXPIRE=7d
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_URL=redis://localhost:6379
CLOUDFLARE_R2_ENDPOINT=
CLOUDFLARE_R2_BUCKET=
CLOUDFLARE_R2_PUBLIC_URL=
CLOUDFLARE_ACCESS_KEY_ID=
CLOUDFLARE_SECRET_ACCESS_KEY=
```

#### client/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

#### admin/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Step 4: Initialize Database

```bash
cd server

# Run data from file: ../server/src/seeders/magnula_db.sql

# Seed sample data
npm run seed
```

### Step 5: Start the Application

Start each module in different terminals:

```bash
# Terminal 1: Server
cd server
npm run dev

# Terminal 2: Client
cd client
npm run dev

# Terminal 3: Admin
cd admin
npm run dev
```

## Detailed Documentation

Each module has its own detailed documentation:

- Client README - Usage guide, code structure, features of the customer website.
- Server README - API documentation, database structure and data constraints, server deployment guide
- Admin README - Dashboard usage guide, information about pages used for data management.

---

## License

This project is referenced and has approval to use data from Magnula Furniture brand (https://www.magnula.com).