// Role & Permission Assignment Routes - RBAC - Manage user roles and role permissions

import express from 'express';
import {
  assignRoleToUser,
  removeRoleFromUser,
  getUserRoles,
  assignPermissionToRole,
  removePermissionFromRole,
  getRolePermissions,
} from '../../controllers/rbac/assignment/index.js';
import { verifyToken } from '../../middleware/auth/index.js';

const router = express.Router();

// User Roles
// POST /api/users/:id/assign-role
router.post('/users/:id/assign-role', verifyToken, assignRoleToUser);

// DELETE /api/users/:id/roles/:roleId - Remove role from user (admin only)
router.delete('/users/:id/roles/:roleId', verifyToken, removeRoleFromUser);

// GET /api/users/:id/roles - Get all roles of a user
router.get('/users/:id/roles', verifyToken, getUserRoles);

// Role Permissions
// POST /api/roles/:id/assign-permission - Assign permission to role (admin only)
router.post('/roles/:id/assign-permission', verifyToken, assignPermissionToRole);

// DELETE /api/roles/:id/permissions/:permissionId - Remove permission from role (admin only)
router.delete('/roles/:id/permissions/:permissionId', verifyToken, removePermissionFromRole);

// GET /api/roles/:id/permissions - Get all permissions of a role
router.get('/roles/:id/permissions', verifyToken, getRolePermissions);

export default router;
