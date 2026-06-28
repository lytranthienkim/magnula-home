import express from 'express';
import { getAllOrders, getOrderById, getOrderByOrderCode, createOrder, updateOrderStatus } from '../../controllers/order/orders/index.js';
import { verifyToken, checkPermission } from '../../middleware/auth/index.js';

const router = express.Router();

// GET /api/orders - Lấy tất cả orders
router.get('/', verifyToken, checkPermission('orders:read'), getAllOrders);
// GET /api/orders/track/:orderCode - Tracking order by code (public)
router.get('/track/:orderCode', getOrderByOrderCode);
// GET /api/orders/:id - Lấy chi tiết order (public)
router.get('/:id', getOrderById);
// POST /api/orders - Tạo order (KHÔNG cần login - guest tạo tài khoản tự động)
router.post('/', createOrder);
// PUT /api/orders/:id - Cập nhật order status
router.put('/:id', verifyToken, checkPermission('orders:update'), updateOrderStatus);
// NOTE: DELETE not supported - Orders are immutable financial records

export default router;
