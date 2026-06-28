import express from 'express';
import { getAllImages, addProductImage, getProductImages, updateImage, deleteImage, restoreImage } from '../../controllers/product/images/index.js';
import { verifyToken, checkPermission } from '../../middleware/auth/index.js';

const router = express.Router();

// GET all images - /products/images
router.get('/images', getAllImages);

// GET images of specific product - /products/:id/images
router.get('/:id/images', getProductImages);

// POST add image to product - /products/:id/images
router.post('/:id/images', verifyToken, checkPermission('products:create'), addProductImage);

// PUT update image - /products/images/:imageId
router.put('/images/:imageId', verifyToken, checkPermission('products:update'), updateImage);

// DELETE image (soft delete) - /products/images/:imageId
router.delete('/images/:imageId', verifyToken, checkPermission('products:delete'), deleteImage);

// POST restore image - /products/images/:imageId/restore
router.post('/images/:imageId/restore', verifyToken, checkPermission('products:update'), restoreImage);

export default router;
