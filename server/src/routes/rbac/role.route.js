import express from 'express';
import { getAllRoles, createRole, getRoleById, updateRole, deleteRole, restoreRole, getRolePermissions } from '../../controllers/rbac/role/index.js';
import { verifyToken } from '../../middleware/auth/index.js';

const router = express.Router();

// GET /api/roles - Read all roles
router.get('/roles', verifyToken, getAllRoles);

// POST /api/roles - Create new role
router.post('/roles', verifyToken, createRole);

// GET /api/roles/:id - Get role by ID
router.get('/roles/:id', verifyToken, getRoleById);

// GET /api/roles/:id/permissions - Get permissions assigned to role
router.get('/roles/:id/permissions', verifyToken, getRolePermissions);

// PUT /api/roles/:id - Update role
router.put('/roles/:id', verifyToken, updateRole);

// DELETE /api/roles/:id - Delete role
router.delete('/roles/:id', verifyToken, deleteRole);

// PATCH /api/roles/:id/restore - Restore soft-deleted role
router.patch('/roles/:id/restore', verifyToken, restoreRole);

export default router;
