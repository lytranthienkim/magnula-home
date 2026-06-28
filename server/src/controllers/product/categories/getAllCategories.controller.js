// Get All Categories Controller

import db from '../../../config/db.js';
import { Op } from 'sequelize';

export const getAllCategories = async (req, res) => {
  try {
    const { Category } = db.models;

    // Check if requesting deleted items
    const isDeleted = req.query.deleted === 'true';

    // Build where clause based on deleted status
    const whereClause = isDeleted
      ? { deletedAt: { [Op.not]: null } } // Only deleted items
      : { deletedAt: null }; // Only non-deleted items (both active and inactive)

    const categories = await Category.findAll({
      where: whereClause,
      paranoid: !isDeleted, // Disable paranoid mode to include deleted items when requested
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Get all categories error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
