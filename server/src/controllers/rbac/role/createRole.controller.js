import db from '../../../config/db.js';

export const createRole = async (req, res) => {
  try {
    const { Role } = db.models;
    const { roleName } = req.body;

    if (!roleName || typeof roleName !== 'string' || roleName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Role name is required and must be at least 2 characters',
      });
    }

    const existingRole = await Role.findOne({ where: { roleName: roleName.trim() } });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        error: 'Role already exists',
      });
    }

    const role = await Role.create({
      roleName: roleName.trim(),
    });

    res.status(201).json({
      success: true,
      data: role,
      message: `Role "${role.roleName}" created successfully`,
    });
  } catch (error) {
    console.error('Create role error:', error);

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const message = error.errors?.[0]?.message || 'Role name already exists';
      return res.status(400).json({
        success: false,
        error: message,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create role',
    });
  }
};
