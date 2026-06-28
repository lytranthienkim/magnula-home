// Create Material Controller

import db from '../../../config/db.js';

export const createMaterial = async (req, res) => {
  try {
    const { Material } = db.models;
    const { name, description } = req.body;

    // Validate input
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Material name is required',
      });
    }

    // Check if material already exists (only active)
    const existing = await Material.findOne({
      where: { name: name.trim(), isActive: true, deletedAt: null },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Material name already exists',
      });
    }

    // Create material
    const material = await Material.create({
      name: name.trim(),
      description: description || null,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      data: material,
      message: 'Material created successfully',
    });
  } catch (error) {
    console.error('Create material error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create material',
    });
  }
};
