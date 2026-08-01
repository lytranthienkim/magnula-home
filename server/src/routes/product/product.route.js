import express from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, restoreProduct } from '../../controllers/product/products/index.js';
import { verifyToken, checkPermission } from '../../middleware/auth/index.js';
import { cacheMiddleware } from '../../middleware/cache/index.js';

const router = express.Router();

router.get('/', cacheMiddleware(3600), getAllProducts);
router.get('/:id', cacheMiddleware(3600), getProductById);

router.post('/', verifyToken, checkPermission('products:create'), createProduct);

router.put('/:id', verifyToken, checkPermission('products:update'), updateProduct);

router.patch('/:id/restore', verifyToken, checkPermission('products:delete'), restoreProduct);

router.delete('/:id', verifyToken, checkPermission('products:delete'), deleteProduct);

export default router;
