import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../../../config/db.js';
import { isValidEmail } from '../../../utils/validation.js';
import { getCookieOptions } from '../../../config/cookies.js';

export const register = async (req, res) => {
  try {
    const { User, UserRole, Role } = db.models;
    const { email, password, fullName, rememberMe = false } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and full name are required',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Email already registered',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      passwordHash,
      fullName,
      isActive: true,
    });

    const userRole = await Role.findOne({ where: { roleName: 'user' } });
    if (userRole) {
      await UserRole.create({
        userId: newUser.id,
        roleId: userRole.id,
      });
    }

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

    const permissions = new Set();
    userWithRoles.userRoles.forEach(userRole => {
      if (userRole.Role.rolePermissions) {
        userRole.Role.rolePermissions.forEach(rp => {
          permissions.add(rp.Permission.permissionKey);
        });
      }
    });

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

    const cookieOptions = getCookieOptions(rememberMe);
    res.cookie('authToken', token, cookieOptions);

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
