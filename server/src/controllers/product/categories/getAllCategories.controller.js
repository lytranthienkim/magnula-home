import db from '../../../config/db.js';
import { Op } from 'sequelize';

export const getAllCategories = async (req, res) => {
  try {
    const { Category } = db.models;

    const isDeleted = req.query.deleted === 'true';

    const whereClause = isDeleted
      ? { deletedAt: { [Op.not]: null } }
      : { deletedAt: null };

    const categories = await Category.findAll({
      where: whereClause,
      paranoid: !isDeleted,
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
