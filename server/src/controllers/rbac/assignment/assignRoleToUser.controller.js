// Assign Role to User Controller

import db from '../../../config/db.js';

export const assignRoleToUser = async (req, res) => {
  try {
    const { User, Role, UserRole } = db.models;
    const { id } = req.params;
    const { roleId } = req.body;

    // Validate input
    if (!roleId) {
      return res.status(400).json({
        success: false,
        error: 'Role ID is required',
      });
    }

    // Get user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Get role
    const role = await Role.findByPk(roleId);
    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found',
      });
    }

    // Check if user already has this role
    const existing = await UserRole.findOne({
      where: { userId: id, roleId },
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'User already has this role',
      });
    }

    // Assign role
    const userRole = await UserRole.create({
      userId: id,
      roleId,
    });

    res.status(201).json({
      success: true,
      data: userRole,
      message: `Role "${role.roleName}" assigned to user successfully`,
    });
  } catch (error) {
    console.error('Assign role error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to assign role',
      details: error.message,
    });
  }
};
