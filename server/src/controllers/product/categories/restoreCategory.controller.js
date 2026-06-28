// Restore Category Controller - Restore soft-deleted category

import db from '../../../config/db.js';

export const restoreCategory = async (req, res) => {
  try {
    const { Category } = db.models;
    const { id } = req.params;

    // Find the soft-deleted category
    const category = await Category.findByPk(id, { paranoid: false });
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    // Check if category is actually deleted
    if (!category.deletedAt) {
      return res.status(400).json({
        success: false,
        error: 'Category is not deleted',
      });
    }

    // Restore the category
    await category.restore();

    // Verify restoration
    const restoredCategory = await Category.findByPk(id);
    if (!restoredCategory) {
      return res.status(500).json({
        success: false,
        error: 'Failed to restore category - verification failed',
      });
    }

    res.json({
      success: true,
      data: {
        categoryId: restoredCategory.id,
        categoryName: restoredCategory.categoryName,
      },
      message: `Category "${restoredCategory.categoryName}" restored successfully`,
    });
  } catch (error) {
    console.error('Restore category error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
