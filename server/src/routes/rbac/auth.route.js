// Auth Routes - RBAC - Login, password management, user authentication

import express from 'express';
import { login, register, checkAuth, logout, getCurrentUser, changePassword, forgotPassword, checkUserRole, resetPasswordByAdmin, bootstrapAdmin, setupAdminPermissions } from '../../controllers/rbac/auth/index.js';
import { verifyToken, checkPermission } from '../../middleware/auth/index.js';

const router = express.Router();

router.post('/bootstrap-admin', bootstrapAdmin);

router.post('/setup-permissions', setupAdminPermissions);

router.post('/login', login);

router.post('/register', register);

// Stateless auth check - reads cookie directly without middleware
router.get('/check-auth', checkAuth);

router.post('/logout', verifyToken, logout);

router.get('/me', verifyToken, getCurrentUser);

router.post('/change-password', verifyToken, changePassword);

router.post('/forgot-password', forgotPassword);

router.post('/check-user-role', checkUserRole);

router.post('/reset-password-by-admin', verifyToken, checkPermission('users:update'), resetPasswordByAdmin);

// DEBUG ENDPOINT - Test role detection (remove after debugging)
router.get('/debug-role/:email', async (req, res) => {
  try {
    const db = require('../../config/db.js').default;
    const { User, UserRole, Role } = db.models;
    const { email } = req.params;


    // 1. Find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.json({
        success: false,
        message: 'User not found',
      });
    }

    // 2. Try Sequelize include method
    const userWithRoles = await User.findByPk(user.id, {
      raw: false,
      include: [{
        model: UserRole,
        as: 'userRoles',
        attributes: [],
        include: [{
          model: Role,
          attributes: ['id', 'roleName']
        }],
      }],
    });

    // 3. Check role detection
    const roles = userWithRoles?.userRoles
      ?.map(ur => ur?.Role?.roleName)
      .filter(Boolean) || [];

    const isAdmin = userWithRoles?.userRoles?.some(ur => {
      const roleName = ur.Role?.roleName?.toLowerCase();
      return roleName === 'admin';
    });

    res.json({
      success: true,
      debug: {
        userFound: !!user,
        userEmail: user?.email,
        sequelizeResult: userWithRoles ? {
          id: userWithRoles.id,
          email: userWithRoles.email,
          userRolesCount: userWithRoles.userRoles?.length || 0,
          roles: userWithRoles.userRoles?.map(ur => ({
            roleId: ur.roleId,
            roleName: ur.Role?.roleName,
          })) || [],
        } : null,
        extractedRoles: roles,
        isAdmin: isAdmin,
      },
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
