// Get All Users Controller - Retrieve list of all users

import db from '../../../config/db.js';
import { Op } from 'sequelize';

export const getAllUsers = async (req, res) => {
  try {
    const { User, UserRole, Role } = db.models;

    // Check if requesting inactive items (Users don't have paranoid delete, use isActive instead)
    const isInactive = req.query.deleted === 'true';

    // Get all users (active or inactive)
    const users = await User.findAll({
      where: {
        isActive: isInactive ? false : true, // Show inactive if deleted=true, active if deleted=false
      },
      attributes: { exclude: ['passwordHash'] },
      attributes: { exclude: ['passwordHash'] },
      include: [{
        model: UserRole,
        as: 'userRoles',
        include: [{ model: Role, attributes: ['id', 'roleName'] }],
      }],
    });

    // Format response
    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      isActive: user.isActive,
      roles: user.userRoles.map(ur => ur.Role.roleName),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    res.json({
      success: true,
      data: formattedUsers,
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve users',
    });
  }
};
