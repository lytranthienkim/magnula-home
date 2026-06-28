// Update Category Status Controller - Activate/Deactivate only

import db from '../../../config/db.js';

export const updateCategoryStatus = async (req, res) => {
  try {
    const { Category } = db.models;
    const { id } = req.params;
    const { isActive } = req.body;

    if (isActive === undefined || typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'isActive (boolean) is required',
      });
    }

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    if (category.isActive === isActive) {
      return res.status(400).json({
        success: false,
        error: `Category is already ${isActive ? 'activated' : 'deactivated'}`,
      });
    }

    await category.update({ isActive });

    res.json({
      success: true,
      data: {
        categoryId: category.id,
        categoryName: category.categoryName,
        isActive: category.isActive,
      },
      message: `Category "${category.categoryName}" ${isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    console.error('Update category status error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
