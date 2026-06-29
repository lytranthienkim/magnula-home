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
router.post('/fabric-types', verifyToken, checkPermission('fabric_type:create'), createFabricType);

// PUT /api/products/fabric-types/:id - Update fabric type
router.put('/fabric-types/:id', verifyToken, checkPermission('fabric_type:update'), updateFabricType);

// PATCH /api/products/fabric-types/:id/status - Activate/Deactivate 
router.patch('/fabric-types/:id/status', verifyToken, checkPermission('fabric_type:update'), updateFabricTypeStatus);

// DELETE /api/products/fabric-types/:id - Delete fabric type 
router.delete('/fabric-types/:id', verifyToken, checkPermission('fabric_type:delete'), deleteFabricType);

// PATCH /api/products/fabric-types/:id/restore 
router.patch('/fabric-types/:id/restore', verifyToken, checkPermission('fabric_type:delete'), restoreFabricType);

export default router;
