import express from 'express';
import { getAllOrders, getOrderById, getOrderByOrderCode, createOrder, updateOrder } from '../../controllers/order/orders/index.js';
import { verifyToken, checkPermission } from '../../middleware/auth/index.js';

const router = express.Router();

// GET /api/orders - Lấy tất cả orders
router.get('/', verifyToken, checkPermission('orders:read'), getAllOrders);
// Tracking order by code 
router.get('/track/:orderCode', getOrderByOrderCode);
// Lấy chi tiết order 
router.get('/:id', getOrderById);
// POST /api/orders 
router.post('/', createOrder);
// PUT /api/orders/:id 
router.put('/:id', verifyToken, checkPermission('orders:update'), updateOrder);

export default router;
