import express from 'express';
import { getOrderItems, updateOrderItem, deleteOrderItem } from '../../controllers/order/orderItems/index.js';
import { verifyToken, checkPermission } from '../../middleware/auth/index.js';

const router = express.Router();

// GET /api/orders/:orderId/items - Lấy tất cả items của order (public - customers can view their order items)
router.get('/:orderId/items', getOrderItems);

// PUT /api/order-items/:itemId - Cập nhật order item
router.put('/:itemId', verifyToken, checkPermission('orders:update'), updateOrderItem);

// DELETE /api/order-items/:itemId - Xóa order item
router.delete('/:itemId', verifyToken, checkPermission('orders:update'), deleteOrderItem);

export default router;
