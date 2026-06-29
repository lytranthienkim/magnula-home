// Collection Routes

import express from 'express';
import { getAllCollections, getCollectionById, createCollection, updateCollection, updateCollectionStatus, deleteCollection, restoreCollection, bulkCreateCollections } from '../../controllers/product/collections/index.js';
import { verifyToken, checkPermission } from '../../middleware/auth/index.js';

const router = express.Router();

// GET /api/products/collections - Lấy danh sách collections (PUBLIC)
router.get('/collections', getAllCollections);

// GET /api/products/collections/:id - Lấy chi tiết collection (PUBLIC)
router.get('/collections/:id', getCollectionById);

// POST /api/products/collections - Create collection
router.post('/collections', verifyToken, checkPermission('collections:create'), createCollection);

// POST /api/products/collections/bulk - Bulk create collections
router.post('/collections/bulk', verifyToken, checkPermission('collections:create'), bulkCreateCollections);

// PUT /api/products/collections/:id - Update collection
router.put('/collections/:id', verifyToken, checkPermission('collections:update'), updateCollection);

// PATCH /api/products/collections/:id/status - Activate/Deactivate 
router.patch('/collections/:id/status', verifyToken, checkPermission('collections:update'), updateCollectionStatus);

// DELETE /api/products/collections/:id - Delete collection 
router.delete('/collections/:id', verifyToken, checkPermission('collections:delete'), deleteCollection);

// PATCH /api/products/collections/:id/restore - Restore soft-deleted collection
router.patch('/collections/:id/restore', verifyToken, checkPermission('collections:delete'), restoreCollection);

export default router;
