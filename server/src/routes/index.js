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

// auth
router.use('/auth', authRoutes);

// User
router.use('/users', userRoutes);

// role and permission 
router.use('/', roleRoutes);   
router.use('/', permissionRoutes); 

// assignment 
router.use('/', assignmentRoutes);

// Product
router.use('/products', collectionRoutes);
router.use('/products', collectionImageRoutes);
router.use('/products', categoryRoutes);
router.use('/products', imageRoutes);
router.use('/products', variantRoutes);
router.use('/products', fabricTypeRoutes);
router.use('/products', materialRoutes);
router.use('/products', roomSuitabilityRoutes);
router.use('/products', productRoutes);

// Order
router.use('/orders', orderRoutes);
router.use('/orders', orderItemRoutes);
router.use('/product-requests', requestRoutes);
router.use('/payment-methods', paymentMethodRoutes);

//Server
router.get('/server', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

export default router;
