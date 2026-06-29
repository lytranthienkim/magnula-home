// Get All Users Controller - Retrieve list of all users

import db from '../../../config/db.js';
import { Op } from 'sequelize';

export const getAllUsers = async (req, res) => {
  try {
    const { User, UserRole, Role } = db.models;

    const isInactive = req.query.deleted === 'true';

    // Get all users (active or inactive)
    const users = await User.findAll({
      where: {
        isActive: isInactive ? false : true,
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
      status: user.isActive ? 'active' : 'inactive',
      roles: user.userRoles.map(ur => ({
        id: ur.Role.id,
        roleName: ur.Role.roleName,
      })),
      roleId: user.userRoles.length > 0 ? user.userRoles[0].Role.id : null,
      role: user.userRoles.length > 0 ? user.userRoles[0].Role.roleName : null,
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
