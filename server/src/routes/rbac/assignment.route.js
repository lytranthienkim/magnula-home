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

router.get('/users/:id/roles', verifyToken, checkPermission('roles:read'), getUserRoles);
router.get('/roles/:id/permissions', verifyToken, checkPermission('roles:read'), getRolePermissions);

router.post('/roles/:id/assign-permission', verifyToken, checkPermission('roles:update'), assignPermissionToRole);
router.post('/users/:id/assign-role', verifyToken, checkPermission('users:update_status'), assignRoleToUser);

router.delete('/roles/:id/permissions/:permissionId', verifyToken, checkPermission('roles:update'), removePermissionFromRole);
router.delete('/users/:id/roles/:roleId', verifyToken, checkPermission('users:update_status'), removeRoleFromUser);

export default router;
