import db from '../../../config/db.js';
import { invalidateMaterialCache } from '../../../middleware/cache/cacheInvalidation.js';

export const deleteMaterial = async (req, res) => {
  try {
    const { Material, Product } = db.models;
    const { id } = req.params;

    const material = await Material.findByPk(id);
    if (!material) {
      return res.status(404).json({
        success: false,
        error: 'Material not found',
      });
    }

    const productCount = await Product.count({
      where: { materialId: id, deletedAt: null },
    });

    if (productCount > 0) {
      return res.status(403).json({
        success: false,
        error: `Cannot delete material "${material.name}" because there are ${productCount} products using it`,
      });
    }

    await material.destroy();

    const deletedMaterial = await Material.findByPk(id, { paranoid: false });
    if (!deletedMaterial || !deletedMaterial.deletedAt) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete material - verification failed',
      });
    }

    await invalidateMaterialCache();

    res.status(200).json({
      success: true,
      message: 'Material deleted successfully',
    });
  } catch (error) {
    console.error('Delete material error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete material',
    });
  }
};
