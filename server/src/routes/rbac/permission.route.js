import express from 'express';
import { getAllPermissions, createPermission, getPermissionById, updatePermission, deletePermission, restorePermission } from '../../controllers/rbac/permission/index.js';
import { verifyToken } from '../../middleware/auth/index.js';

const router = express.Router();

// GET /api/permissions - Read all permissions
router.get('/permissions', verifyToken, getAllPermissions);

// POST /api/permissions - Create new permission
router.post('/permissions', verifyToken, createPermission);

// GET /api/permissions/:id - Get permission by ID
router.get('/permissions/:id', verifyToken, getPermissionById);

// PUT /api/permissions/:id - Update permission
router.put('/permissions/:id', verifyToken, updatePermission);

// DELETE /api/permissions/:id - Delete permission
router.delete('/permissions/:id', verifyToken, deletePermission);

// PATCH /api/permissions/:id/restore - Restore soft-deleted permission
router.patch('/permissions/:id/restore', verifyToken, restorePermission);

export default router;
