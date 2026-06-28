// Delete Room Suitability Controller - Soft delete with product reference check

import db from '../../../config/db.js';

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

    // Check if any product uses this room suitability (regardless of product status)
    const productCount = await Product.count({
      where: { roomSuitabilityId: id, deletedAt: null },
    });

    if (productCount > 0) {
      return res.status(403).json({
        success: false,
        error: `Cannot delete room suitability "${roomSuitability.name}" because there are ${productCount} products using it`,
      });
    }

    // Safe to soft delete using Sequelize's destroy method
    await roomSuitability.destroy();

    // Verify deletion was successful
    const deletedRoomSuitability = await RoomSuitability.findByPk(id, { paranoid: false });
    if (!deletedRoomSuitability || !deletedRoomSuitability.deletedAt) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete room suitability - verification failed',
      });
    }

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
