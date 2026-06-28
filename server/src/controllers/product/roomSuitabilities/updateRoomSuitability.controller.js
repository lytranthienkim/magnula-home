// Update Room Suitability Controller

import db from '../../../config/db.js';

export const updateRoomSuitability = async (req, res) => {
  try {
    const { RoomSuitability } = db.models;
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    // Get room suitability
    const roomSuitability = await RoomSuitability.findByPk(id);

    if (!roomSuitability) {
      return res.status(404).json({
        success: false,
        error: 'Room suitability not found',
      });
    }

    // Validate name if changing
    if (name && name.trim() !== roomSuitability.name) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Room suitability name cannot be empty',
        });
      }

      const existing = await RoomSuitability.findOne({
        where: { name: name.trim(), isActive: true, deletedAt: null },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'Room suitability name already exists',
        });
      }
    }

    // Update fields
    if (name) roomSuitability.name = name.trim();
    if (description !== undefined) roomSuitability.description = description || null;
    if (isActive !== undefined) roomSuitability.isActive = isActive;

    await roomSuitability.save();

    res.status(200).json({
      success: true,
      data: roomSuitability,
      message: 'Room suitability updated successfully',
    });
  } catch (error) {
    console.error('Update room suitability error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update room suitability',
    });
  }
};
