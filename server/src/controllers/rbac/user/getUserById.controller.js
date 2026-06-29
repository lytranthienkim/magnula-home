// Get User By ID Controller - Retrieve single user details

import db from '../../../config/db.js';

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { User, UserRole, Role } = db.models;

    // Get user by ID
    const user = await User.findByPk(id, {
      attributes: { exclude: ['passwordHash'] },
      include: [{
        model: UserRole,
        as: 'userRoles',
        include: [{ model: Role, attributes: ['id', 'roleName'] }],
      }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Format response
    const formattedUser = {
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
    };

    res.json({
      success: true,
      data: formattedUser,
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get user',
    });
  }
};
