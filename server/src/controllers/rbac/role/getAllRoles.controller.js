// Get All Roles Controller

import db from '../../../config/db.js';
import { Op } from 'sequelize';

export const getAllRoles = async (req, res) => {
  try {
    const { Role } = db.models;

    // Check if requesting deleted items
    const isDeleted = req.query.deleted === 'true';

    const roles = await Role.findAll({
      where: isDeleted
        ? { deletedAt: { [Op.not]: null } } // Only deleted items
        : { deletedAt: null }, // Only active items
      paranoid: !isDeleted, // Disable paranoid mode to include deleted items when requested
      attributes: isDeleted
        ? ['id', 'roleName', 'createdAt', 'deletedAt']
        : ['id', 'roleName', 'createdAt'],
    });

    res.json({
      success: true,
      data: roles,
    });
  } catch (error) {
    console.error('Get all roles error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
