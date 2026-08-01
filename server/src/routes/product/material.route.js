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
import { cacheMiddleware } from '../../middleware/cache/index.js';

const router = express.Router();

router.get('/materials', cacheMiddleware(3600), getAllMaterials);

router.post('/materials', verifyToken, checkPermission('material:create'), createMaterial);

router.put('/materials/:id', verifyToken, checkPermission('material:update'), updateMaterial);

router.patch('/materials/:id/status', verifyToken, checkPermission('material:update'), updateMaterialStatus);
router.patch('/materials/:id/restore', verifyToken, checkPermission('material:delete'), restoreMaterial);

router.delete('/materials/:id', verifyToken, checkPermission('material:delete'), deleteMaterial);

export default router;
