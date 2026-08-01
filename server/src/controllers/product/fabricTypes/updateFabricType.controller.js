import db from '../../../config/db.js';
import { invalidateFabricTypeCache } from '../../../middleware/cache/cacheInvalidation.js';

export const updateFabricType = async (req, res) => {
  try {
    const { FabricType } = db.models;
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const fabricType = await FabricType.findByPk(id);

    if (!fabricType) {
      return res.status(404).json({
        success: false,
        error: 'Fabric type not found',
      });
    }

    if (name && name.trim() !== fabricType.name) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Fabric type name cannot be empty',
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
    }

    if (name) fabricType.name = name.trim();
    if (description !== undefined) fabricType.description = description || null;
    if (isActive !== undefined) fabricType.isActive = isActive;

    await fabricType.save();

    await invalidateFabricTypeCache();

    res.status(200).json({
      success: true,
      data: fabricType,
      message: 'Fabric type updated successfully',
    });
  } catch (error) {
    console.error('Update fabric type error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update fabric type',
    });
  }
};
