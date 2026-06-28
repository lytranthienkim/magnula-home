// Assign Permission to Role Controller

import db from '../../../config/db.js';

export const assignPermissionToRole = async (req, res) => {
  try {
    const { Role, Permission, RolePermission } = db.models;
    const { id } = req.params;
    const { permissionId } = req.body;

    // Validate input
    if (!permissionId) {
      return res.status(400).json({
        success: false,
        error: 'Permission ID is required',
      });
    }

    // Get role
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found',
      });
    }

    // Get permission
    const permission = await Permission.findByPk(permissionId);
    if (!permission) {
      return res.status(404).json({
        success: false,
        error: 'Permission not found',
      });
    }

    // Check if role already has this permission
    const existing = await RolePermission.findOne({
      where: { roleId: id, permissionId },
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Role already has this permission',
      });
    }

    // Assign permission
    const rolePermission = await RolePermission.create({
      roleId: id,
      permissionId,
    });

    res.status(201).json({
      success: true,
      data: rolePermission,
      message: `Permission "${permission.permissionKey}" assigned to role successfully`,
    });
  } catch (error) {
    console.error('Assign permission error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to assign permission',
      details: error.message,
    });
  }
};
