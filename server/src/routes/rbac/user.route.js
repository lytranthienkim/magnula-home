import express from 'express';
import { getAllUsers, getUserById, createUser, updateProfile, resetPassword, updateUserStatus, restoreUser } from '../../controllers/rbac/user/index.js';
import { verifyToken, checkPermission } from '../../middleware/auth/index.js';

const router = express.Router();

router.get('/', verifyToken, checkPermission('users:read'), getAllUsers);
router.get('/:id', verifyToken, checkPermission('users:read'), getUserById);

router.post('/', verifyToken, checkPermission('users:create'), createUser);
router.post('/:id/reset-password', verifyToken, checkPermission('users:update_password'), resetPassword);

router.put('/profile', verifyToken, updateProfile);
router.put('/profile/:id', verifyToken, checkPermission('users:update_status'), updateProfile);

router.patch('/:id/status', verifyToken, checkPermission('users:update_status'), updateUserStatus);
router.patch('/:id/restore', verifyToken, checkPermission('users:update_status'), restoreUser);

export default router;
