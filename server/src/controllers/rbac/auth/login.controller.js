// Login Controller - Stateless authentication with HttpOnly Cookies
// Sets JWT token in HttpOnly cookie with rememberMe logic

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../../../config/db.js';
import { getCookieOptions } from '../../../config/cookies.js';

export const login = async (req, res) => {
  try {
    const { User, UserRole, Role } = db.models;
    const { email, password, rememberMe = false } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    // Find user by email with roles and permissions
    const user = await User.findOne({
      where: { email },
      include: [{
        model: UserRole,
        as: 'userRoles',
        include: [{
          model: Role,
          attributes: ['id', 'roleName'],
          include: [{
            model: db.models.RolePermission,
            as: 'rolePermissions',
            include: [{
              model: db.models.Permission,
              attributes: ['id', 'permissionKey'],
            }],
          }],
        }],
      }],
    });

    // Check user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // Check if user account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Account is deactivated. Contact administrator to reactivate.',
      });
    }

    // Extract unique permissions from all roles
    const permissions = new Set();
    user.userRoles.forEach(userRole => {
      if (userRole.Role.rolePermissions) {
        userRole.Role.rolePermissions.forEach(rp => {
          permissions.add(rp.Permission.permissionKey);
        });
      }
    });

    // Generate JWT token with permissions
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        roles: user.userRoles.map(ur => ur.Role.roleName),
        permissions: Array.from(permissions),
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );

    // Set HttpOnly cookie based on rememberMe flag
    const cookieOptions = getCookieOptions(rememberMe);
    res.cookie('authToken', token, cookieOptions);

    // Send user data (without sensitive info, no token in response)
    res.json({
      success: true,
      data: {
        userId: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: user.userRoles.map(ur => ur.Role.roleName),
        permissions: Array.from(permissions),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
    });
  }
};
