// Product Routes - CRUD products

import express from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, restoreProduct } from '../../controllers/product/products/index.js';
import { verifyToken, checkPermission } from '../../middleware/auth/index.js';

const router = express.Router();

// GET /api/products - Lấy danh sách sản phẩm (PUBLIC)
router.get('/', getAllProducts);
// GET /api/products/:id - Lấy chi tiết sản phẩm (PUBLIC)
router.get('/:id', getProductById);
// POST /api/products - Create product
router.post('/', verifyToken, checkPermission('products:create'), createProduct);
// PUT /api/products/:id - Update product
router.put('/:id', verifyToken, checkPermission('products:update'), updateProduct);
// DELETE /api/products/:id - Delete product
router.delete('/:id', verifyToken, checkPermission('products:delete'), deleteProduct);
// PATCH /api/products/:id/restore - Restore soft-deleted product
router.patch('/:id/restore', verifyToken, checkPermission('products:delete'), restoreProduct);

export default router;
