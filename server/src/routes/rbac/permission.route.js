import express from 'express';
import { getAllPermissions, createPermission, getPermissionById, updatePermission, deletePermission, restorePermission } from '../../controllers/rbac/permission/index.js';
import { verifyToken, checkPermission } from '../../middleware/auth/index.js';

const router = express.Router();

router.get('/permissions', verifyToken, checkPermission('permissions:read'), getAllPermissions);
router.get('/permissions/:id', verifyToken, checkPermission('permissions:read'), getPermissionById);

router.post('/permissions', verifyToken, checkPermission('permissions:create'), createPermission);

router.put('/permissions/:id', verifyToken, checkPermission('permissions:update'), updatePermission);

router.patch('/permissions/:id/restore', verifyToken, checkPermission('permissions:update'), restorePermission);

router.delete('/permissions/:id', verifyToken, checkPermission('permissions:delete'), deletePermission);

export default router;
