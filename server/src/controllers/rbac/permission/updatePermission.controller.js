// Update Permission Controller

import db from '../../../config/db.js';

export const updatePermission = async (req, res) => {
  try {
    const { Permission } = db.models;
    const { id } = req.params;
    const { permissionKey, description } = req.body;

    // Get permission
    const permission = await Permission.findByPk(id);
    if (!permission) {
      return res.status(404).json({
        success: false,
        error: 'Permission not found',
      });
    }

    // Validate new permission key (if changing)
    if (permissionKey && permissionKey !== permission.permissionKey) {
      if (typeof permissionKey !== 'string' || permissionKey.trim().length < 2) {
        return res.status(400).json({
          success: false,
          error: 'Permission key must be at least 2 characters',
        });
      }

      const existingPermission = await Permission.findOne({
        where: {
          permissionKey: permissionKey.trim(),
          id: { [db.Sequelize.Op.ne]: id },
        },
      });
      if (existingPermission) {
        return res.status(400).json({
          success: false,
          error: 'Permission key already exists',
        });
      }
    }

    // Update fields
    if (permissionKey) permission.permissionKey = permissionKey.trim();
    if (description !== undefined) permission.description = description || null;

    await permission.save();

    res.json({
      success: true,
      data: permission,
      message: 'Permission updated successfully',
    });
  } catch (error) {
    console.error('Update permission error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
