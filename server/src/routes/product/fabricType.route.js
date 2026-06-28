// Fabric Type Routes

import express from 'express';
import {
  getAllFabricTypes,
  createFabricType,
  updateFabricType,
  deleteFabricType,
  restoreFabricType,
  updateFabricTypeStatus,
} from '../../controllers/product/fabricTypes/index.js';
import { verifyToken, checkPermission } from '../../middleware/auth/index.js';

const router = express.Router();

// GET /api/products/fabric-types - Get all active fabric types (PUBLIC)
router.get('/fabric-types', getAllFabricTypes);

// POST /api/products/fabric-types - Create fabric type
router.post('/fabric-types', verifyToken, checkPermission('fabric_types:create'), createFabricType);

// PUT /api/products/fabric-types/:id - Update fabric type
router.put('/fabric-types/:id', verifyToken, checkPermission('fabric_types:update'), updateFabricType);

// PATCH /api/products/fabric-types/:id/status - Activate/Deactivate (update isActive)
router.patch('/fabric-types/:id/status', verifyToken, checkPermission('fabric_types:update'), updateFabricTypeStatus);

// DELETE /api/products/fabric-types/:id - Delete fabric type (soft delete with check)
router.delete('/fabric-types/:id', verifyToken, checkPermission('fabric_types:delete'), deleteFabricType);

// PATCH /api/products/fabric-types/:id/restore - Restore soft-deleted fabric type
router.patch('/fabric-types/:id/restore', verifyToken, checkPermission('fabric_types:delete'), restoreFabricType);

export default router;
