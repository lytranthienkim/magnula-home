// Check User Role Controller - Verify email & get user role for password reset flow

import db from '../../../config/db.js';
import { isValidEmail } from '../../../utils/validation.js';

export const checkUserRole = async (req, res) => {
  try {
    const { User, UserRole, Role } = db.models;
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Email not found in system',
      });
    }

    // Get user roles with full Role details
    const userWithRoles = await User.findByPk(user.id, {
      include: [{
        model: UserRole,
        as: 'userRoles',
        include: [{
          model: Role,
          attributes: ['id', 'roleName']
        }],
      }],
    });

    // Extract role names - ensure we're getting the roleName properly
    const roles = userWithRoles?.userRoles
      ?.map(ur => ur?.Role?.roleName)
      .filter(Boolean) || [];

    // Normalize role names: "Administrator" -> "admin" for consistency
    const normalizedRoles = roles.map(role => {
      const lower = role.toLowerCase();
      if (lower === 'administrator') return 'admin';
      return lower;
    });

    const primaryRole = normalizedRoles[0] || 'user';

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: primaryRole,
        roles: roles,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error('Check user role error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify user',
    });
  }
};
