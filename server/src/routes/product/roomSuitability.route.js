// Room Suitability Routes

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

const router = express.Router();

// GET /api/products/room-suitabilities - Get all active room suitabilities (PUBLIC)
router.get('/room-suitabilities', getAllRoomSuitabilities);

// POST /api/products/room-suitabilities - Create room suitability
router.post('/room-suitabilities', verifyToken, checkPermission('room_suitabilities:create'), createRoomSuitability);

// PUT /api/products/room-suitabilities/:id - Update room suitability
router.put('/room-suitabilities/:id', verifyToken, checkPermission('room_suitabilities:update'), updateRoomSuitability);

// PATCH /api/products/room-suitabilities/:id/status - Activate/Deactivate 
router.patch('/room-suitabilities/:id/status', verifyToken, checkPermission('room_suitabilities:update'), updateRoomSuitabilityStatus);

// DELETE /api/products/room-suitabilities/:id - Delete room suitability 
router.delete('/room-suitabilities/:id', verifyToken, checkPermission('room_suitabilities:delete'), deleteRoomSuitability);

// PATCH /api/products/room-suitabilities/:id/restore - Restore soft-deleted room suitability
router.patch('/room-suitabilities/:id/restore', verifyToken, checkPermission('room_suitabilities:delete'), restoreRoomSuitability);

export default router;
