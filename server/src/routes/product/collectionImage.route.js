// Collection Images Routes

import express from 'express';
import {
  getAllCollectionImages,
  getCollectionImagesByCollectionId,
  addCollectionImage,
  updateCollectionImage,
  deleteCollectionImage,
} from '../../controllers/product/collectionImages/index.js';
import { verifyToken, checkPermission } from '../../middleware/auth/index.js';

const router = express.Router();

// GET all collection images (Admin only)
router.get('/collection-images', verifyToken, checkPermission('collections:read'), getAllCollectionImages);

// GET images of specific collection (PUBLIC)
router.get('/collections/:collectionId/images', getCollectionImagesByCollectionId);

// POST add image to collection
router.post('/collections/:collectionId/images', verifyToken, checkPermission('collections:update'), addCollectionImage);

// PUT update collection image
router.put('/collection-images/:imageId', verifyToken, checkPermission('collections:update'), updateCollectionImage);

// DELETE collection image
router.delete('/collection-images/:imageId', verifyToken, checkPermission('collections:delete'), deleteCollectionImage);

export default router;
