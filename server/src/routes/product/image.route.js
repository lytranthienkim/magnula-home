import express from 'express';
import { getAllImages, addProductImage, getProductImages, updateImage, deleteImage, restoreImage } from '../../controllers/product/images/index.js';
import { verifyToken, checkPermission } from '../../middleware/auth/index.js';
import { cacheMiddleware } from '../../middleware/cache/index.js';

const router = express.Router();

router.get('/images', cacheMiddleware(3600), getAllImages);
router.get('/:id/images', cacheMiddleware(3600), getProductImages);

router.post('/:id/images', verifyToken, checkPermission('products:create'), addProductImage);
router.post('/images/:imageId/restore', verifyToken, checkPermission('products:update'), restoreImage);

router.put('/images/:imageId', verifyToken, checkPermission('products:update'), updateImage);

router.delete('/images/:imageId', verifyToken, checkPermission('products:delete'), deleteImage);

export default router;
