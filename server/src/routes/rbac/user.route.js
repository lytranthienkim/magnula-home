import express from 'express';
import { getAllUsers, getUserById, createUser, updateProfile, resetPassword, updateUserStatus, restoreUser } from '../../controllers/rbac/user/index.js';
import { verifyToken, checkPermission } from '../../middleware/auth/index.js';

const router = express.Router();

// lay toan bo user
router.get('/', verifyToken, checkPermission('users:read'), getAllUsers);

// lay user = id
router.get('/:id', verifyToken, checkPermission('users:read'), getUserById);

// tao user moi
router.post('/', verifyToken, checkPermission('users:create'), createUser);

// update profile
router.put('/profile', verifyToken, updateProfile);

// PUT /api/profile/:id - Admin updates user profile
router.put('/profile/:id', verifyToken, checkPermission('users:update_status'), updateProfile);

// POST /api/users/:id/reset-password - Reset user password
router.post('/:id/reset-password', verifyToken, checkPermission('users:update_password'), resetPassword);

// PATCH /api/users/:id/status - Activate/Deactivate user
router.patch('/:id/status', verifyToken, checkPermission('users:update_status'), updateUserStatus);

// PATCH /api/users/:id/restore - Restore inactive user
router.patch('/:id/restore', verifyToken, checkPermission('users:update_status'), restoreUser);

export default router;
