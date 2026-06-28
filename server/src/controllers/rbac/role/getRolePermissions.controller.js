// Get Role Permissions Controller - Retrieve all permissions assigned to a specific role

import db from '../../../config/db.js';

export const getRolePermissions = async (req, res) => {
  try {
    const { Role, Permission, RolePermission } = db.models;
    const { id } = req.params;

    // Verify role exists
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found',
      });
    }

    // Get all permissions assigned to this role
    const permissions = await Permission.findAll({
      include: [{
        model: RolePermission,
        as: 'permissionRoles',
        where: { roleId: id },
        attributes: [],
      }],
      attributes: ['id', 'permissionKey', 'description', 'createdAt'],
    });

    // Transform to match frontend expectations (add permissionId field)
    const formattedPermissions = permissions.map((perm) => ({
      permissionId: perm.id,
      id: perm.id,
      permissionKey: perm.permissionKey,
      description: perm.description,
      createdAt: perm.createdAt,
    }));

    res.json({
      success: true,
      data: formattedPermissions,
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
