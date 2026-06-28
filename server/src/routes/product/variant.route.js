import express from 'express';
import { getAllVariants, createProductVariant, checkStock, getProductVariants, updateVariant } from '../../controllers/product/variants/index.js';
import { checkPermission, verifyToken } from '../../middleware/auth/index.js';

const router = express.Router();

// GET all variants
router.get('/variants', getAllVariants);

// POST create variant for product
router.post('/:id/variants', verifyToken, checkPermission('products:create'), createProductVariant);

// POST check stock
router.post('/check-stock', checkStock);

// GET variants of specific product
router.get('/:id/variants', getProductVariants);

// PUT update variant
router.put('/variants/:variantId', verifyToken, checkPermission('products:update'), updateVariant);

export default router;