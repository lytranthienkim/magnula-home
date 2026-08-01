import db from '../../../config/db.js';
import { invalidateCategoryCache } from '../../../middleware/cache/cacheInvalidation.js';

export const createCategory = async (req, res) => {
  try {
    const { Category } = db.models;
    const { categoryName, description } = req.body;

    if (!categoryName) {
      return res.status(400).json({
        success: false,
        error: 'categoryName is required',
      });
    }

    const category = await Category.create({
      categoryName,
      description: description || null,
      isActive: true,
    });

    await invalidateCategoryCache();

    res.status(201).json({
      success: true,
      data: {
        id: category.id,
        categoryName: category.categoryName,
        description: category.description,
        isActive: category.isActive,
      },
      message: `Category "${category.categoryName}" created successfully`,
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
