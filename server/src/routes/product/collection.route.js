import express from 'express';
import { getAllCollections, getCollectionById, createCollection, updateCollection, updateCollectionStatus, deleteCollection, restoreCollection, bulkCreateCollections } from '../../controllers/product/collections/index.js';
import { verifyToken, checkPermission } from '../../middleware/auth/index.js';
import { cacheMiddleware } from '../../middleware/cache/index.js';

const router = express.Router();

router.get('/collections', cacheMiddleware(3600), getAllCollections);
router.get('/collections/:id', cacheMiddleware(3600), getCollectionById);

router.post('/collections', verifyToken, checkPermission('collections:create'), createCollection);
router.post('/collections/bulk', verifyToken, checkPermission('collections:create'), bulkCreateCollections);

router.put('/collections/:id', verifyToken, checkPermission('collections:update'), updateCollection);

router.patch('/collections/:id/status', verifyToken, checkPermission('collections:update'), updateCollectionStatus);
router.patch('/collections/:id/restore', verifyToken, checkPermission('collections:delete'), restoreCollection);

router.delete('/collections/:id', verifyToken, checkPermission('collections:delete'), deleteCollection);

export default router;
