import express from 'express';
import { getAllRoles, createRole, getRoleById, updateRole, deleteRole, restoreRole } from '../../controllers/rbac/role/index.js';
import { verifyToken, checkPermission } from '../../middleware/auth/index.js';

const router = express.Router();

router.get('/roles', verifyToken, checkPermission('roles:read'), getAllRoles);
router.get('/roles/:id', verifyToken, checkPermission('roles:read'), getRoleById);

router.post('/roles', verifyToken, checkPermission('roles:create'), createRole);

router.put('/roles/:id', verifyToken, checkPermission('roles:update'), updateRole);

router.patch('/roles/:id/restore', verifyToken, checkPermission('roles:update'), restoreRole);

router.delete('/roles/:id', verifyToken, checkPermission('roles:delete'), deleteRole);

export default router;
