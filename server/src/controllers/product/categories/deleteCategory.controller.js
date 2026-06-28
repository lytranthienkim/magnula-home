// Delete Category Controller - Soft delete with product reference check

import db from '../../../config/db.js';

export const deleteCategory = async (req, res) => {
  try {
    const { Category, Product } = db.models;
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    // Check if any product uses this category (regardless of product status)
    const productCount = await Product.count({
      where: { categoryId: id, deletedAt: null },
    });

    if (productCount > 0) {
      return res.status(403).json({
        success: false,
        error: `Cannot delete category "${category.categoryName}" because there are ${productCount} products using it`,
      });
    }

    // Safe to soft delete using Sequelize's destroy method
    await category.destroy();

    // Verify deletion was successful
    const deletedCategory = await Category.findByPk(id, { paranoid: false });
    if (!deletedCategory || !deletedCategory.deletedAt) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete category - verification failed',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete category',
    });
  }
};
