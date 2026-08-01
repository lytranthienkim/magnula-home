import express from 'express';
import {
  getAllCollectionImages,
  getCollectionImagesByCollectionId,
  addCollectionImage,
  updateCollectionImage,
  deleteCollectionImage,
} from '../../controllers/product/collectionImages/index.js';
import { verifyToken, checkPermission } from '../../middleware/auth/index.js';
import { cacheMiddleware } from '../../middleware/cache/index.js';

const router = express.Router();

router.get('/collection-images', verifyToken, checkPermission('collections:read'), getAllCollectionImages);
router.get('/collections/:collectionId/images', cacheMiddleware(3600), getCollectionImagesByCollectionId);

router.post('/collections/:collectionId/images', verifyToken, checkPermission('collections:update'), addCollectionImage);

router.put('/collection-images/:imageId', verifyToken, checkPermission('collections:update'), updateCollectionImage);

router.delete('/collection-images/:imageId', verifyToken, checkPermission('collections:delete'), deleteCollectionImage);

export default router;
