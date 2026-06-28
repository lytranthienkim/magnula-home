// Get Current User Controller - Fetch current authenticated user

import db from '../../../config/db.js';

export const getCurrentUser = async (req, res) => {
  try {
    const { User, UserRole, Role } = db.models;
    const userId = req.user.userId;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['passwordHash'] },
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
      return res.status(404).json({
        success: false,
        error: 'User not found',
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

    res.json({
      success: true,
      data: {
        ...user.toJSON(),
        roles: user.userRoles.map(ur => ur.Role.roleName),
        permissions: Array.from(permissions),
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
    });
  }
};
