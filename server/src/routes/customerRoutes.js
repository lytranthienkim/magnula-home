import express from 'express';
import * as customerController from '../controllers/customerController.js';

const router = express.Router();

// Lấy tất cả khách hàng
router.get('/customers', customerController.getAllCustomers);

// Lấy khách hàng theo ID
router.get('/customers/:id', customerController.getCustomerById);

// Lấy khách hàng theo email
router.get('/customers/email/:email', customerController.getCustomerByEmail);

// Tìm kiếm khách hàng
router.get('/customers/search', customerController.searchCustomerByName);

// Cập nhật khách hàng
router.put('/customers/:id', customerController.updateCustomer);

// Xóa khách hàng
router.delete('/customers/:id', customerController.deleteCustomer);

export default router;
