import db from '../../../config/db.js';
import { invalidateFabricTypeCache } from '../../../middleware/cache/cacheInvalidation.js';

export const restoreFabricType = async (req, res) => {
  try {
    const { FabricType } = db.models;
    const { id } = req.params;

    const fabricType = await FabricType.findByPk(id, { paranoid: false });
    if (!fabricType) {
      return res.status(404).json({
        success: false,
        error: 'Fabric type not found',
      });
    }

    if (!fabricType.deletedAt) {
      return res.status(400).json({
        success: false,
        error: 'Fabric type is not deleted',
      });
    }

    await fabricType.restore();

    const restoredFabricType = await FabricType.findByPk(id);
    if (!restoredFabricType) {
      return res.status(500).json({
        success: false,
        error: 'Failed to restore fabric type - verification failed',
      });
    }

    res.json({
      success: true,
      data: {
        fabricTypeId: restoredFabricType.id,
        name: restoredFabricType.name,
      },
      message: `Fabric type "${restoredFabricType.name}" restored successfully`,
    });
  } catch (error) {
    console.error('Restore fabric type error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
