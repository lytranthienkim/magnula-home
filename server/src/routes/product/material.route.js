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
router.post('/materials', verifyToken, checkPermission('materials:create'), createMaterial);

// PUT /api/products/materials/:id - Update material
router.put('/materials/:id', verifyToken, checkPermission('materials:update'), updateMaterial);

// PATCH /api/products/materials/:id/status - Activate/Deactivate (update isActive)
router.patch('/materials/:id/status', verifyToken, checkPermission('materials:update'), updateMaterialStatus);

// DELETE /api/products/materials/:id - Delete material (soft delete with check)
router.delete('/materials/:id', verifyToken, checkPermission('materials:delete'), deleteMaterial);

// PATCH /api/products/materials/:id/restore - Restore soft-deleted material
router.patch('/materials/:id/restore', verifyToken, checkPermission('materials:delete'), restoreMaterial);

export default router;
