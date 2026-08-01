import db from '../../../config/db.js';
import { invalidateFabricTypeCache } from '../../../middleware/cache/cacheInvalidation.js';

export const deleteFabricType = async (req, res) => {
  try {
    const { FabricType, Product } = db.models;
    const { id } = req.params;

    const fabricType = await FabricType.findByPk(id);
    if (!fabricType) {
      return res.status(404).json({
        success: false,
        error: 'Fabric type not found',
      });
    }

    const productCount = await Product.count({
      where: { fabricTypeId: id, deletedAt: null },
    });

    if (productCount > 0) {
      return res.status(403).json({
        success: false,
        error: `Cannot delete fabric type "${fabricType.name}" because there are ${productCount} products using it`,
      });
    }

    await fabricType.destroy();

    const deletedFabricType = await FabricType.findByPk(id, { paranoid: false });
    if (!deletedFabricType || !deletedFabricType.deletedAt) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete fabric type - verification failed',
      });
    }

    await invalidateFabricTypeCache();

    res.status(200).json({
      success: true,
      message: 'Fabric type deleted successfully',
    });
  } catch (error) {
    console.error('Delete fabric type error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete fabric type',
    });
  }
};
