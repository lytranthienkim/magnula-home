// Get Category By ID Controller

import db from '../../../config/db.js';

export const getCategoryById = async (req, res) => {
  try {
    const { Category } = db.models;
    const { id } = req.params;

    const category = await Category.findByPk(id, {
      attributes: { exclude: ['deletedAt'] },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
