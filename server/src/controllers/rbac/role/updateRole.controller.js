// Update Role Controller

import db from '../../../config/db.js';

export const updateRole = async (req, res) => {
  try {
    const { Role } = db.models;
    const { id } = req.params;
    const { roleName, description } = req.body;

    // Get role
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found',
      });
    }

    // Validate new role name (if changing)
    if (roleName && roleName !== role.roleName) {
      if (typeof roleName !== 'string' || roleName.trim().length < 2) {
        return res.status(400).json({
          success: false,
          error: 'Role name must be at least 2 characters',
        });
      }

      const existingRole = await Role.findOne({
        where: { roleName: roleName.trim(), id: { [db.Sequelize.Op.ne]: id } },
      });
      if (existingRole) {
        return res.status(400).json({
          success: false,
          error: 'Role name already exists',
        });
      }
    }

    // Update fields
    if (roleName) role.roleName = roleName.trim();
    if (description !== undefined) role.description = description || null;

    await role.save();

    res.json({
      success: true,
      data: role,
      message: 'Role updated successfully',
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
