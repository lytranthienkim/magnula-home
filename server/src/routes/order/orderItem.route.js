import express from 'express';
import { getOrderItems, updateOrderItem, deleteOrderItem } from '../../controllers/order/orderItems/index.js';
import { verifyToken, checkPermission } from '../../middleware/auth/index.js';

const router = express.Router();

router.get('/:orderId/items', getOrderItems);

router.put('/:itemId', verifyToken, checkPermission('orders:update'), updateOrderItem);

router.delete('/:itemId', verifyToken, checkPermission('orders:update'), deleteOrderItem);

export default router;
