// Restore Room Suitability Controller - Restore soft-deleted room suitability

import db from '../../../config/db.js';

export const restoreRoomSuitability = async (req, res) => {
  try {
    const { RoomSuitability } = db.models;
    const { id } = req.params;

    // Find the soft-deleted room suitability
    const roomSuitability = await RoomSuitability.findByPk(id, { paranoid: false });
    if (!roomSuitability) {
      return res.status(404).json({
        success: false,
        error: 'Room suitability not found',
      });
    }

    // Check if room suitability is actually deleted
    if (!roomSuitability.deletedAt) {
      return res.status(400).json({
        success: false,
        error: 'Room suitability is not deleted',
      });
    }

    // Restore the room suitability
    await roomSuitability.restore();

    // Verify restoration
    const restoredRoomSuitability = await RoomSuitability.findByPk(id);
    if (!restoredRoomSuitability) {
      return res.status(500).json({
        success: false,
        error: 'Failed to restore room suitability - verification failed',
      });
    }

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
