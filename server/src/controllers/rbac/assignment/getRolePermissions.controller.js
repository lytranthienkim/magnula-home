// Get Role Permissions Controller

import db from '../../../config/db.js';

export const getRolePermissions = async (req, res) => {
  try {
    const { Role, Permission, RolePermission } = db.models;
    const { id } = req.params;

    // Get role
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found',
      });
    }

    // Get role permissions
    const rolePermissions = await RolePermission.findAll({
      where: { roleId: id },
      include: [
        {
          model: Permission,
          attributes: ['id', 'permissionKey', 'description'],
        },
      ],
    });

    res.json({
      success: true,
      data: rolePermissions,
      message: `Retrieved ${rolePermissions.length} permission(s) for role`,
    });
  } catch (error) {
    console.error('Get role permissions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch role permissions',
      details: error.message,
    });
  }
};
