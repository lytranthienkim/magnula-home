import express from 'express';
import { getAllOrders, getOrderById, getOrderByOrderCode, createOrder, updateOrder } from '../../controllers/order/orders/index.js';
import { verifyToken, checkPermission } from '../../middleware/auth/index.js';

const router = express.Router();

router.get('/', verifyToken, checkPermission('orders:read'), getAllOrders);
router.get('/track/:orderCode', getOrderByOrderCode);
router.get('/:id', getOrderById);

router.post('/', createOrder);

router.put('/:id', verifyToken, checkPermission('orders:update'), updateOrder);

export default router;
