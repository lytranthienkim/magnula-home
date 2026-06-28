// Update Room Suitability Status Controller - Activate/Deactivate only

import db from '../../../config/db.js';

export const updateRoomSuitabilityStatus = async (req, res) => {
  try {
    const { RoomSuitability } = db.models;
    const { id } = req.params;
    const { isActive } = req.body;

    if (isActive === undefined || typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'isActive (boolean) is required',
      });
    }

    const roomSuitability = await RoomSuitability.findByPk(id);
    if (!roomSuitability) {
      return res.status(404).json({
        success: false,
        error: 'Room suitability not found',
      });
    }

    if (roomSuitability.isActive === isActive) {
      return res.status(400).json({
        success: false,
        error: `Room suitability is already ${isActive ? 'activated' : 'deactivated'}`,
      });
    }

    await roomSuitability.update({ isActive });

    res.json({
      success: true,
      data: {
        roomSuitabilityId: roomSuitability.id,
        name: roomSuitability.name,
        isActive: roomSuitability.isActive,
      },
      message: `Room suitability "${roomSuitability.name}" ${isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    console.error('Update room suitability status error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
