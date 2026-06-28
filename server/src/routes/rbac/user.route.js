// User Routes - RBAC - Account Management

import express from 'express';
import { getAllUsers, getUserById, createUser, updateProfile, resetPassword, updateUserStatus, restoreUser } from '../../controllers/rbac/user/index.js';
import { verifyToken } from '../../middleware/auth/index.js';

const router = express.Router();

// GET /api/users - Read all users
router.get('/', verifyToken, getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', verifyToken, getUserById);

// POST /api/users - Create new user
router.post('/', verifyToken, createUser);

// PUT /api/users/:id - Admin updates user profile (alias for /profile/:id)
router.put('/:id', verifyToken, updateProfile);

// PUT /api/profile - User updates own profile
router.put('/profile', verifyToken, updateProfile);

// PUT /api/profile/:id - Admin updates user profile
router.put('/profile/:id', verifyToken, updateProfile);

// POST /api/users/:id/reset-password - Reset user password
router.post('/:id/reset-password', verifyToken, resetPassword);

// PATCH /api/users/:id/status - Activate/Deactivate user
router.patch('/:id/status', verifyToken, updateUserStatus);

// PATCH /api/users/:id/restore - Restore inactive user
router.patch('/:id/restore', verifyToken, restoreUser);

export default router;
