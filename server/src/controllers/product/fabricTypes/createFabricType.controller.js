import db from '../../../config/db.js';
import { invalidateFabricTypeCache } from '../../../middleware/cache/cacheInvalidation.js';

export const createFabricType = async (req, res) => {
  try {
    const { FabricType } = db.models;
    const { name, description } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Fabric type name is required',
      });
    }

    const existing = await FabricType.findOne({
      where: { name: name.trim(), isActive: true, deletedAt: null },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Fabric type name already exists',
      });
    }

    const fabricType = await FabricType.create({
      name: name.trim(),
      description: description || null,
      isActive: true,
    });

    await invalidateFabricTypeCache();

    res.status(201).json({
      success: true,
      data: fabricType,
      message: 'Fabric type created successfully',
    });
  } catch (error) {
    console.error('Create fabric type error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create fabric type',
    });
  }
};
