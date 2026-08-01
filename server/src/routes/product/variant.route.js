import express from 'express';
import { getAllVariants, createProductVariant, checkStock, getProductVariants, updateVariant } from '../../controllers/product/variants/index.js';
import { checkPermission, verifyToken } from '../../middleware/auth/index.js';

const router = express.Router();

router.get('/variants', getAllVariants);
router.get('/:id/variants', getProductVariants);

router.post('/:id/variants', verifyToken, checkPermission('products:create'), createProductVariant);
router.post('/check-stock', checkStock);

router.put('/variants/:variantId', verifyToken, checkPermission('products:update'), updateVariant);

export default router;