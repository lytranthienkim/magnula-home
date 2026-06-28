// Get All Permissions Controller

import db from '../../../config/db.js';
import { Op } from 'sequelize';

export const getAllPermissions = async (req, res) => {
  try {
    const { Permission } = db.models;

    // Check if requesting deleted items
    const isDeleted = req.query.deleted === 'true';

    const permissions = await Permission.findAll({
      where: isDeleted
        ? { deletedAt: { [Op.not]: null } } // Only deleted items
        : { deletedAt: null }, // Only active items
      paranoid: !isDeleted, // Disable paranoid mode to include deleted items when requested
      attributes: isDeleted
        ? ['id', 'permissionKey', 'description', 'createdAt', 'deletedAt']
        : ['id', 'permissionKey', 'description', 'createdAt'],
    });

    res.json({
      success: true,
      data: permissions,
    });
  } catch (error) {
    console.error('Get all permissions error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
