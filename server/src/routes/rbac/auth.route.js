import express from 'express';
import { login, register, checkAuth, logout, getCurrentUser, changePassword, forgotPassword, checkUserRole, resetPasswordByAdmin } from '../../controllers/rbac/auth/index.js';
import { verifyToken, checkPermission } from '../../middleware/auth/index.js';

const router = express.Router();

router.get('/check-auth', checkAuth);
router.get('/me', verifyToken, getCurrentUser);

router.post('/login', login);
router.post('/register', register);
router.post('/change-password', verifyToken, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/check-user-role', checkUserRole);
router.post('/reset-password-by-admin', verifyToken, checkPermission('users:update'), resetPasswordByAdmin);
router.post('/logout', verifyToken, logout);

export default router;
