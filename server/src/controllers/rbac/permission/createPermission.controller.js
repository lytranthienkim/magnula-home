// Create Permission Controller

import db from '../../../config/db.js';

export const createPermission = async (req, res) => {
  try {
    const { Permission } = db.models;
    const { permissionKey, description } = req.body;

    // Validate input
    if (!permissionKey || typeof permissionKey !== 'string' || permissionKey.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Permission key is required and must be at least 2 characters',
      });
    }

    // Check if permission already exists
    const existingPermission = await Permission.findOne({
      where: { permissionKey: permissionKey.trim() },
    });
    if (existingPermission) {
      return res.status(400).json({
        success: false,
        error: 'Permission already exists',
      });
    }

    // Create new permission
    const permission = await Permission.create({
      permissionKey: permissionKey.trim(),
      description: description || null,
    });

    res.status(201).json({
      success: true,
      data: permission,
      message: `Permission "${permission.permissionKey}" created successfully`,
    });
  } catch (error) {
    console.error('Create permission error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
