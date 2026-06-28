// Update Category Controller

import db from '../../../config/db.js';

export const updateCategory = async (req, res) => {
  try {
    const { Category } = db.models;
    const { id } = req.params;
    const { categoryName, description, isActive } = req.body;

    // Get category
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    // Update fields
    if (categoryName) category.categoryName = categoryName;
    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.json({
      success: true,
      data: {
        id: category.id,
        categoryName: category.categoryName,
        description: category.description,
        isActive: category.isActive,
      },
      message: `Category "${category.categoryName}" updated successfully`,
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
