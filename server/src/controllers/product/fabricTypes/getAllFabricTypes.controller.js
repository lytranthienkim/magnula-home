// Get All Active Fabric Types Controller

import db from '../../../config/db.js';
import { Op } from 'sequelize';

export const getAllFabricTypes = async (req, res) => {
  try {
    const { FabricType } = db.models;

    // Check if requesting deleted items
    const isDeleted = req.query.deleted === 'true';

    const fabricTypes = await FabricType.findAll({
      where: isDeleted
        ? { deletedAt: { [Op.not]: null } } // Only deleted items
        : { deletedAt: null }, // Only non-deleted items (both active and inactive)
      paranoid: !isDeleted, // Disable paranoid mode to include deleted items when requested
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: fabricTypes,
    });
  } catch (error) {
    console.error('Get fabric types error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch fabric types',
    });
  }
};
