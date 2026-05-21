import express from 'express';
import * as productController from '../controllers/productController.js';

const router = express.Router();

// Lấy tất cả sản phẩm
router.get('/products', productController.getAllProducts);

// Lấy sản phẩm theo ID
router.get('/products/:id', productController.getProductById);

// Lấy sản phẩm theo Collection
router.get('/collection/:collectionId/products', productController.getProductsByCollection);

// Tạo sản phẩm mới
router.post('/products', productController.createProduct);

// Cập nhật sản phẩm
router.put('/products/:id', productController.updateProduct);

// Xóa sản phẩm
router.delete('/products/:id', productController.deleteProduct);

export default router;
