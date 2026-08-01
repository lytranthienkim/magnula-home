import express from 'express';
import {
  getAllRoomSuitabilities,
  createRoomSuitability,
  updateRoomSuitability,
  deleteRoomSuitability,
  restoreRoomSuitability,
  updateRoomSuitabilityStatus,
} from '../../controllers/product/roomSuitabilities/index.js';
import { verifyToken, checkPermission } from '../../middleware/auth/index.js';
import { cacheMiddleware } from '../../middleware/cache/index.js';

const router = express.Router();

router.get('/room-suitabilities', cacheMiddleware(3600), getAllRoomSuitabilities);

router.post('/room-suitabilities', verifyToken, checkPermission('room_suitabilities:create'), createRoomSuitability);

router.put('/room-suitabilities/:id', verifyToken, checkPermission('room_suitabilities:update'), updateRoomSuitability);

router.patch('/room-suitabilities/:id/status', verifyToken, checkPermission('room_suitabilities:update'), updateRoomSuitabilityStatus);
router.patch('/room-suitabilities/:id/restore', verifyToken, checkPermission('room_suitabilities:delete'), restoreRoomSuitability);

router.delete('/room-suitabilities/:id', verifyToken, checkPermission('room_suitabilities:delete'), deleteRoomSuitability);

export default router;
