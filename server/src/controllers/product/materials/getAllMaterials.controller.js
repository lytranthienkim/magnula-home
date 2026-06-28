// Get All Active Materials Controller

import db from '../../../config/db.js';
import { Op } from 'sequelize';

export const getAllMaterials = async (req, res) => {
  try {
    const { Material } = db.models;

    // Check if requesting deleted items
    const isDeleted = req.query.deleted === 'true';

    const materials = await Material.findAll({
      where: isDeleted
        ? { deletedAt: { [Op.not]: null } } // Only deleted items
        : { deletedAt: null }, // Only non-deleted items (both active and inactive)
      paranoid: !isDeleted, // Disable paranoid mode to include deleted items when requested
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: materials,
    });
  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch materials',
    });
  }
};
