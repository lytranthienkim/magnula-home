import db from '../../../config/db.js';
import { invalidateMaterialCache } from '../../../middleware/cache/cacheInvalidation.js';

export const restoreMaterial = async (req, res) => {
  try {
    const { Material } = db.models;
    const { id } = req.params;

    const material = await Material.findByPk(id, { paranoid: false });
    if (!material) {
      return res.status(404).json({
        success: false,
        error: 'Material not found',
      });
    }

    if (!material.deletedAt) {
      return res.status(400).json({
        success: false,
        error: 'Material is not deleted',
      });
    }

    await material.restore();

    const restoredMaterial = await Material.findByPk(id);
    if (!restoredMaterial) {
      return res.status(500).json({
        success: false,
        error: 'Failed to restore material - verification failed',
      });
    }

    await invalidateMaterialCache();

    res.json({
      success: true,
      data: {
        materialId: restoredMaterial.id,
        name: restoredMaterial.name,
      },
      message: `Material "${restoredMaterial.name}" restored successfully`,
    });
  } catch (error) {
    console.error('Restore material error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
