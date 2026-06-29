import express from 'express';
import { getAllPermissions, createPermission, getPermissionById, updatePermission, deletePermission, restorePermission } from '../../controllers/rbac/permission/index.js';
import { verifyToken, checkPermission } from '../../middleware/auth/index.js';

const router = express.Router();

// GET /api/permissions - Read all permissions
router.get('/permissions', verifyToken, checkPermission('permissions:read'), getAllPermissions);

// POST /api/permissions - Create new permission
router.post('/permissions', verifyToken, checkPermission('permissions:create'), createPermission);

// GET /api/permissions/:id - Get permission by ID
router.get('/permissions/:id', verifyToken, checkPermission('permissions:read'), getPermissionById);

// PUT /api/permissions/:id - Update permission
router.put('/permissions/:id', verifyToken, checkPermission('permissions:update'), updatePermission);

// DELETE /api/permissions/:id - Delete permission
router.delete('/permissions/:id', verifyToken, checkPermission('permissions:delete'), deletePermission);

// PATCH /api/permissions/:id/restore - Restore soft-deleted permission
router.patch('/permissions/:id/restore', verifyToken, checkPermission('permissions:update'), restorePermission);

export default router;
