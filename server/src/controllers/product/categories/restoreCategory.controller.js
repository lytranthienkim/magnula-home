import db from '../../../config/db.js';
import { invalidateCategoryCache } from '../../../middleware/cache/cacheInvalidation.js';

export const restoreCategory = async (req, res) => {
  try {
    const { Category } = db.models;
    const { id } = req.params;

    const category = await Category.findByPk(id, { paranoid: false });
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    if (!category.deletedAt) {
      return res.status(400).json({
        success: false,
        error: 'Category is not deleted',
      });
    }

    await category.restore();

    const restoredCategory = await Category.findByPk(id);
    if (!restoredCategory) {
      return res.status(500).json({
        success: false,
        error: 'Failed to restore category - verification failed',
      });
    }

    await invalidateCategoryCache();

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
