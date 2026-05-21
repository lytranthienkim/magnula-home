import express from 'express';
import * as orderController from '../controllers/orderController.js';

const router = express.Router();

// Lấy tất cả đơn hàng
router.get('/orders', orderController.getAllOrders);

// Lấy đơn hàng theo ID
router.get('/orders/:id', orderController.getOrderById);

// Lấy đơn hàng của khách hàng
router.get('/customers/:customerId/orders', orderController.getOrdersByCustomerId);

// Lấy đơn hàng theo trạng thái
router.get('/orders/status/:status', orderController.getOrdersByStatus);

// Cập nhật trạng thái đơn hàng
router.put('/orders/:id/status', orderController.updateOrderStatus);

// Xóa đơn hàng
router.delete('/orders/:id', orderController.deleteOrder);

export default router;
