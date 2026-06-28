// Register Controller - User registration with stateless authentication
// Creates new user account and sets HttpOnly cookie

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../../../config/db.js';
import { isValidEmail } from '../../../utils/validation.js';
import { getCookieOptions } from '../../../config/cookies.js';

export const register = async (req, res) => {
  try {
    const { User, UserRole, Role } = db.models;
    const { email, password, fullName, rememberMe = false } = req.body;

    // Validate input
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and full name are required',
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Email already registered',
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user with 'user' role (default role for new registrations)
    const newUser = await User.create({
      email,
      passwordHash,
      fullName,
      isActive: true,
    });

    // Assign 'user' role to new user
    const userRole = await Role.findOne({ where: { roleName: 'user' } });
    if (userRole) {
      await UserRole.create({
        userId: newUser.id,
        roleId: userRole.id,
      });
    }

    // Get user with roles and permissions for JWT
    const userWithRoles = await User.findByPk(newUser.id, {
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

    // Extract unique permissions from all roles
    const permissions = new Set();
    userWithRoles.userRoles.forEach(userRole => {
      if (userRole.Role.rolePermissions) {
        userRole.Role.rolePermissions.forEach(rp => {
          permissions.add(rp.Permission.permissionKey);
        });
      }
    });

    // Generate JWT token with permissions
    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        roles: userWithRoles.userRoles.map(ur => ur.Role.roleName),
        permissions: Array.from(permissions),
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );

    // Set HttpOnly cookie based on rememberMe flag
    const cookieOptions = getCookieOptions(rememberMe);
    res.cookie('authToken', token, cookieOptions);

    // Send user data (without sensitive info, no token in response)
    res.status(201).json({
      success: true,
      data: {
        userId: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        roles: userWithRoles.userRoles.map(ur => ur.Role.roleName),
        permissions: Array.from(permissions),
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed',
    });
  }
};
