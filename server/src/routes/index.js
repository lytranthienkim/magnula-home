// Main Routes File - - Kết nối tất cả API routes - - Định nghĩa base paths

import express from 'express';

// Import route modules
import authRoutes from './rbac/auth.route.js';
import userRoutes from './rbac/user.route.js';
import assignmentRoutes from './rbac/assignment.route.js';
import roleRoutes from './rbac/role.route.js';
import permissionRoutes from './rbac/permission.route.js';
import productRoutes from './product/product.route.js';
import variantRoutes from './product/variant.route.js';
import imageRoutes from './product/image.route.js';
import collectionRoutes from './product/collection.route.js';
import collectionImageRoutes from './product/collectionImage.route.js';
import categoryRoutes from './product/category.route.js';
import fabricTypeRoutes from './product/fabricType.route.js';
import materialRoutes from './product/material.route.js';
import roomSuitabilityRoutes from './product/roomSuitability.route.js';
import orderRoutes from './order/order.route.js';
import orderItemRoutes from './order/orderItem.route.js';
import requestRoutes from './order/request.route.js';
import paymentMethodRoutes from './order/paymentMethod.route.js';
const router = express.Router();

// ==================== AUTH ROUTES ==================== - Login, register, authentication
router.use('/auth', authRoutes);

// ==================== USER ROUTES ==================== - User management
router.use('/users', userRoutes);
router.use('/users', assignmentRoutes);  // User role assignment: /users/:id/assign-role, /users/:id/roles

// ==================== ROLE & PERMISSION ROUTES ==================== - Role and permission management
// Note: These routes include full paths like /roles, /permissions already, so register at root level
router.use('/', roleRoutes);            // Endpoints: /roles, /roles/:id, /roles/:id/assign-permission
router.use('/', permissionRoutes);      // Endpoints: /permissions, /permissions/:id

// ==================== PRODUCT ROUTES ==================== - CRUD sản phẩm, biến thể, hình ảnh, collections, attributes
router.use('/products', collectionRoutes);
router.use('/products', collectionImageRoutes);
router.use('/products', categoryRoutes);
router.use('/products', imageRoutes);
router.use('/products', variantRoutes);
router.use('/products', fabricTypeRoutes);
router.use('/products', materialRoutes);
router.use('/products', roomSuitabilityRoutes);
router.use('/products', productRoutes);

// ==================== ORDER ROUTES ==================== - CRUD đơn hàng, yêu cầu đặt hàng, phương thức thanh toán, order items
router.use('/orders', orderRoutes);
router.use('/orders', orderItemRoutes);
router.use('/product-requests', requestRoutes);
router.use('/payment-methods', paymentMethodRoutes);

// ==================== HEALTH CHECK ==================== - Kiểm tra server hoạt động
router.get('/server', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

export default router;
