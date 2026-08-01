import db from '../../../config/db.js';
import { invalidateRoomSuitabilityCache } from '../../../middleware/cache/cacheInvalidation.js';

export const restoreRoomSuitability = async (req, res) => {
  try {
    const { RoomSuitability } = db.models;
    const { id } = req.params;

    const roomSuitability = await RoomSuitability.findByPk(id, { paranoid: false });
    if (!roomSuitability) {
      return res.status(404).json({
        success: false,
        error: 'Room suitability not found',
      });
    }

    if (!roomSuitability.deletedAt) {
      return res.status(400).json({
        success: false,
        error: 'Room suitability is not deleted',
      });
    }

    await roomSuitability.restore();

    const restoredRoomSuitability = await RoomSuitability.findByPk(id);
    if (!restoredRoomSuitability) {
      return res.status(500).json({
        success: false,
        error: 'Failed to restore room suitability - verification failed',
      });
    }

    await invalidateRoomSuitabilityCache();

    res.json({
      success: true,
      data: {
        roomSuitabilityId: restoredRoomSuitability.id,
        name: restoredRoomSuitability.name,
      },
      message: `Room suitability "${restoredRoomSuitability.name}" restored successfully`,
    });
  } catch (error) {
    console.error('Restore room suitability error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
