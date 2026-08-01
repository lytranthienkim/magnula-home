import db from '../../../config/db.js';
import { invalidateRoomSuitabilityCache } from '../../../middleware/cache/cacheInvalidation.js';

export const deleteRoomSuitability = async (req, res) => {
  try {
    const { RoomSuitability, Product } = db.models;
    const { id } = req.params;

    const roomSuitability = await RoomSuitability.findByPk(id);
    if (!roomSuitability) {
      return res.status(404).json({
        success: false,
        error: 'Room suitability not found',
      });
    }

    const productCount = await Product.count({
      where: { roomSuitabilityId: id, deletedAt: null },
    });

    if (productCount > 0) {
      return res.status(403).json({
        success: false,
        error: `Cannot delete room suitability "${roomSuitability.name}" because there are ${productCount} products using it`,
      });
    }

    await roomSuitability.destroy();

    const deletedRoomSuitability = await RoomSuitability.findByPk(id, { paranoid: false });
    if (!deletedRoomSuitability || !deletedRoomSuitability.deletedAt) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete room suitability - verification failed',
      });
    }

    await invalidateRoomSuitabilityCache();

    res.status(200).json({
      success: true,
      message: 'Room suitability deleted successfully',
    });
  } catch (error) {
    console.error('Delete room suitability error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete room suitability',
    });
  }
};
