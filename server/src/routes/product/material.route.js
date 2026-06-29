// Material Routes

import express from 'express';
import {
  getAllMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  restoreMaterial,
  updateMaterialStatus,
} from '../../controllers/product/materials/index.js';
import { verifyToken, checkPermission } from '../../middleware/auth/index.js';

const router = express.Router();

// GET /api/products/materials - Get all active materials (PUBLIC)
router.get('/materials', getAllMaterials);

// POST /api/products/materials - Create material
router.post('/materials', verifyToken, checkPermission('material:create'), createMaterial);

// PUT /api/products/materials/:id - Update material
router.put('/materials/:id', verifyToken, checkPermission('material:update'), updateMaterial);

// PATCH /api/products/materials/:id/status - Activate/Deactivate 
router.patch('/materials/:id/status', verifyToken, checkPermission('material:update'), updateMaterialStatus);

// DELETE /api/products/materials/:id - Delete material 
router.delete('/materials/:id', verifyToken, checkPermission('material:delete'), deleteMaterial);

// PATCH /api/products/materials/:id/restore - Restore soft-deleted material
router.patch('/materials/:id/restore', verifyToken, checkPermission('material:delete'), restoreMaterial);

export default router;
