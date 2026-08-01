import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../../../config/db.js';
import { getCookieOptions } from '../../../config/cookies.js';

export const login = async (req, res) => {
  try {
    const { User, UserRole, Role } = db.models;
    const { email, password, rememberMe = false } = req.body; 

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

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

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Account is deactivated. Contact administrator to reactivate.',
      });
    }

    const permissions = new Set();
    user.userRoles.forEach(userRole => {
      if (userRole.Role.rolePermissions) {
        userRole.Role.rolePermissions.forEach(rp => {
          permissions.add(rp.Permission.permissionKey);
        });
      }
    });

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

    const cookieOptions = getCookieOptions(rememberMe);
    res.cookie('authToken', token, cookieOptions);

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
