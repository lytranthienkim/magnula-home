import db from '../../../config/db.js';
import { invalidateMaterialCache } from '../../../middleware/cache/cacheInvalidation.js';

export const createMaterial = async (req, res) => {
  try {
    const { Material } = db.models;
    const { name, description } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Material name is required',
      });
    }

    const existing = await Material.findOne({
      where: { name: name.trim(), isActive: true, deletedAt: null },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Material name already exists',
      });
    }

    const material = await Material.create({
      name: name.trim(),
      description: description || null,
      isActive: true,
    });

    await invalidateMaterialCache();

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
