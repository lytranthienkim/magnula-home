// Create Category Controller

import db from '../../../config/db.js';

export const createCategory = async (req, res) => {
  try {
    const { Category } = db.models;
    const { categoryName, description } = req.body;

    // Validate required fields
    if (!categoryName) {
      return res.status(400).json({
        success: false,
        error: 'categoryName is required',
      });
    }

    // Create category
    const category = await Category.create({
      categoryName,
      description: description || null,
      isActive: true,
    });

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
