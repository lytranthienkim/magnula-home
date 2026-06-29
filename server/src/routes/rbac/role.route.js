import express from 'express';
import { getAllRoles, createRole, getRoleById, updateRole, deleteRole, restoreRole } from '../../controllers/rbac/role/index.js';
import { verifyToken, checkPermission } from '../../middleware/auth/index.js';

const router = express.Router();

// GET /api/roles - Get all roles
router.get('/roles', verifyToken, checkPermission('roles:read'), getAllRoles);

// GET /api/roles/:id - Get role by ID
router.get('/roles/:id', verifyToken, checkPermission('roles:read'), getRoleById);

// POST /api/roles - Create role
router.post('/roles', verifyToken, checkPermission('roles:create'), createRole);

// PUT /api/roles/:id - Update role
router.put('/roles/:id', verifyToken, checkPermission('roles:update'), updateRole);

// DELETE /api/roles/:id - Delete role
router.delete('/roles/:id', verifyToken, checkPermission('roles:delete'), deleteRole);

// PATCH /api/roles/:id/restore - Restore soft-deleted role
router.patch('/roles/:id/restore', verifyToken, checkPermission('roles:update'), restoreRole);

export default router;
