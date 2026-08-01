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
import { cacheMiddleware } from '../../middleware/cache/index.js';

const router = express.Router();

router.get('/fabric-types', cacheMiddleware(3600), getAllFabricTypes);

router.post('/fabric-types', verifyToken, checkPermission('fabric_type:create'), createFabricType);

router.put('/fabric-types/:id', verifyToken, checkPermission('fabric_type:update'), updateFabricType);

router.patch('/fabric-types/:id/status', verifyToken, checkPermission('fabric_type:update'), updateFabricTypeStatus);
router.patch('/fabric-types/:id/restore', verifyToken, checkPermission('fabric_type:delete'), restoreFabricType);

router.delete('/fabric-types/:id', verifyToken, checkPermission('fabric_type:delete'), deleteFabricType);

export default router;
