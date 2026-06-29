// Get Role By ID Controller

import db from '../../../config/db.js';

export const getRoleById = async (req, res) => {
  try {
    const { Role } = db.models;
    const { id } = req.params;

    const role = await Role.findByPk(id, {
      attributes: ['id', 'roleName', 'createdAt'],
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found',
      });
    }

    res.json({
      success: true,
      data: role,
    });
  } catch (error) {
    console.error('Get role by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch role',
    });
  }
};
