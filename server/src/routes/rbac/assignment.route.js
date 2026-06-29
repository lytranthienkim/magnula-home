import express from 'express';
import {
  assignRoleToUser,
  removeRoleFromUser,
  getUserRoles,
  assignPermissionToRole,
  removePermissionFromRole,
  getRolePermissions,
} from '../../controllers/rbac/assignment/index.js';
import { verifyToken, checkPermission } from '../../middleware/auth/index.js';

const router = express.Router();

// ==================== USER ROLE ASSIGNMENT ====================
// POST /users/:id/assign-role - Assign role to user
router.post('/users/:id/assign-role', verifyToken, checkPermission('users:update_status'), assignRoleToUser);

// GET /users/:id/roles - Get user's assigned roles
router.get('/users/:id/roles', verifyToken, checkPermission('roles:read'), getUserRoles);

// DELETE /users/:id/roles/:roleId - Remove role from user
router.delete('/users/:id/roles/:roleId', verifyToken, checkPermission('users:update_status'), removeRoleFromUser);

// ==================== ROLE PERMISSION ASSIGNMENT ====================
// GET /roles/:id/permissions - Get permissions assigned to role
router.get('/roles/:id/permissions', verifyToken, checkPermission('roles:read'), getRolePermissions);

// POST /roles/:id/assign-permission - Assign permission to role
router.post('/roles/:id/assign-permission', verifyToken, checkPermission('roles:update'), assignPermissionToRole);

// DELETE /roles/:id/permissions/:permissionId - Remove permission from role
router.delete('/roles/:id/permissions/:permissionId', verifyToken, checkPermission('roles:update'), removePermissionFromRole);

export default router;
