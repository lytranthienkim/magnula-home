// Create Role Controller

import db from '../../../config/db.js';

export const createRole = async (req, res) => {
  try {
    const { Role } = db.models;
    const { roleName, description } = req.body;

    // Validate input
    if (!roleName || typeof roleName !== 'string' || roleName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Role name is required and must be at least 2 characters',
      });
    }

    // Check if role already exists
    const existingRole = await Role.findOne({ where: { roleName: roleName.trim() } });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        error: 'Role already exists',
      });
    }

    // Create new role
    const role = await Role.create({
      roleName: roleName.trim(),
      description: description || null,
    });

    res.status(201).json({
      success: true,
      data: role,
      message: `Role "${role.roleName}" created successfully`,
    });
  } catch (error) {
    console.error('Create role error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
